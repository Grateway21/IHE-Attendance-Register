# IHE Church Attendance Portal (Option A — Static JSON)

This is a small static front-end demo that reads `data.json` and displays **workers** and **members** on the same page.
Files included:
- `index.html` — entry page (loads React from CDN)
- `app.js` — React app (JSX via Babel)
- `data.json` — sample data (workers + members)
- `README.md` — this file

How to use:
1. Unzip the package.
2. Serve the folder with any static server (recommended) or open `index.html` directly in modern browsers.
   - To serve locally: `npx serve .` or `python -m http.server 8000` from the folder.
3. Edit `data.json` to update people and attendance records.
4. Use the search, filters, and export to CSV.

Notes:
- This is intentionally static (no backend). If you want a small Node.js backend to persist edits, ask and I will prepare Option B.
- The CSV export exports currently visible rows only.



## Deploying to GitHub Pages
1. Create a new repository on GitHub (do NOT initialise with README).
2. On your machine run:

```bash
git remote add origin https://github.com/<YOUR-USERNAME>/<REPO-NAME>.git
git branch -M main
git push -u origin main
```

3. In the repository Settings → Pages set source to `main` branch `/ (root)` and save.
Alternatively, you can use the included GitHub Action to deploy to `gh-pages` branch automatically.
