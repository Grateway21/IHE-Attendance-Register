const dataUrl = 'data.json';
let attendance = {};

async function loadData() {
  const res = await fetch(dataUrl);
  const data = await res.json();
  populateTable('workers', data.workers);
  populateTable('members', data.members);
  updateSummary();
}

function populateTable(type, names) {
  const tableBody = document.querySelector(`#${type}Table tbody`);
  names.forEach(name => {
    const row = document.createElement('tr');
    const status = attendance[name] || '';
    row.innerHTML = `
      <td>${name}</td>
      <td id="status-${name.replace(/\s+/g, '_')}">${status}</td>
      <td>
        <button class="present" onclick="mark('${name}', 'Present')">Present</button>
        <button class="absent" onclick="mark('${name}', 'Absent')">Absent</button>
        <button class="excused" onclick="mark('${name}', 'Excused')">Excused</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function mark(name, status) {
  const timestamp = new Date().toLocaleString();
  attendance[name] = { status, timestamp };
  document.getElementById(`status-${name.replace(/\s+/g, '_')}`).textContent = status;
  updateSummary();
}

function updateSummary() {
  const counts = { Present: 0, Absent: 0, Excused: 0 };
  Object.values(attendance).forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
  const total = Object.keys(attendance).length;
  document.getElementById('summary').textContent =
    `✔️ ${counts.Present} Present | ❌ ${counts.Absent} Absent | ⚪ ${counts.Excused} Excused (of ${total} marked)`;
}

function exportAttendance() {
  const rows = [['Name', 'Status', 'Timestamp']];
  for (const [name, record] of Object.entries(attendance)) {
    rows.push([name, record.status, record.timestamp]);
  }
  const csvContent = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const today = new Date().toISOString().split('T')[0];
  a.download = `IHE-Attendance-${today}.csv`;
  a.click();
}

loadData();
