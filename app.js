const { useState, useEffect } = React;

function App() {
  const [data, setData] = useState({workers:[], members:[]});
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(()=> {
    fetch("data.json")
      .then(r=>r.json())
      .then(setData)
      .catch(e=> {
        console.error(e);
        setData({workers:[], members:[]});
      });
  },[]);

  function matches(item, qLower) {
    if(!qLower) return true;
    const fields = Object.values(item).map(v=>String(v).toLowerCase());
    return fields.some(f=>f.includes(qLower));
  }

  function visibleItems() {
    const qLower = q.trim().toLowerCase();
    const byType = [];
    if(typeFilter === "all" || typeFilter === "workers") byType.push(...data.workers.map(x=>({...x, _type:"Worker"})));
    if(typeFilter === "all" || typeFilter === "members") byType.push(...data.members.map(x=>({...x, _type:"Member"})));
    return byType.filter(item => {
      if(!matches(item, qLower)) return false;
      if(dateFilter) {
        return item.attendanceDates && item.attendanceDates.includes(dateFilter);
      }
      return true;
    }).sort((a,b)=> (a._type.localeCompare(b._type) || (a.name || "").localeCompare(b.name)));
  }

  function exportCSV() {
    const items = visibleItems();
    if(items.length === 0) { alert("No rows to export"); return; }
    const headers = ["id","name","_type","role_or_phone","email","attendanceDates"];
    const rows = items.map(it => {
      const role_or_phone = it.role ? it.role : (it.phone ? it.phone : "");
      return [it.id, it.name, it._type, role_or_phone, it.email || "", (it.attendanceDates || []).join("|")];
    });
    const csv = [headers.join(","), ...rows.map(r=>r.map(cell=>`"\${String(cell).replace(/"/g,'""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ihe-visible-attendance.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  const items = visibleItems();

  return (
    <div style={{width:"100%", display:"flex", gap:16}}>
      <div className="card">
        <h3>People ({items.length})</h3>
        <table>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Role / Phone</th><th>Email</th><th>Attendance</th></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it._type + "-" + it.id}>
                <td>{it.name}</td>
                <td>{it._type}</td>
                <td>{it.role ? it.role : (it.phone || "")}</td>
                <td>{it.email || ""}</td>
                <td>{(it.attendanceDates || []).join(", ")}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan="5" className="muted">No results</td></tr>}
          </tbody>
        </table>
      </div>

      <div style={{width:320}}>
        <div className="card">
          <h4>Controls</h4>
          <div style={{display:"flex",flexDirection:"column", gap:8}}>
            <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="workers">Workers</option>
              <option value="members">Members</option>
            </select>
            <label style={{fontSize:13}}>Filter by attendance date</label>
            <input type="date" value={dateFilter} onChange={e=>setDateFilter(e.target.value)} />
            <div style={{marginTop:8}}>
              <button onClick={exportCSV}>Export visible to CSV</button>
            </div>
            <div style={{marginTop:12}} className="muted">Search matches across name, role, email, phone.</div>
          </div>
        </div>

        <div className="card" style={{marginTop:12}}>
          <h4>Summary</h4>
          <div><strong>Workers:</strong> {data.workers.length}</div>
          <div><strong>Members:</strong> {data.members.length}</div>
        </div>
      </div>
    </div>
  );
}

const root = document.getElementById("root");
ReactDOM.createRoot(root).render(<App />);

// connect controls outside React
document.getElementById("search").addEventListener("input", e => {
  const ev = new Event("input", {bubbles:true});
  // find React input and set its value via dispatching
  const input = document.querySelector("input[placeholder='Search...']");
  if(input) { input.value = e.target.value; input.dispatchEvent(ev); }
});
document.getElementById("typeFilter").addEventListener("change", e => {
  const sel = document.querySelector("select[value='all'], select");
  if(sel) { sel.value = e.target.value; sel.dispatchEvent(new Event("change", {bubbles:true})); }
});
document.getElementById("dateFilter").addEventListener("change", e => {
  const d = document.querySelector("input[type='date']");
  if(d) { d.value = e.target.value; d.dispatchEvent(new Event("input", {bubbles:true})); }
});
document.getElementById("exportBtn").addEventListener("click", () => {
  const btn = document.querySelector("button");
  if(btn) btn.click();
});
