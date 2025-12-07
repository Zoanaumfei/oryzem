# Deploying / Testing on Hostinger (and GitHub)

This short guide shows simple steps to push this repository to GitHub and then publish it on Hostinger (static hosting). Replace placeholders with your values.

1) Prepare a local Git commit (PowerShell)

```powershell
# run these in the repository root (where this README is)
git init
git add .
git commit -m "Initial scaffold: static site and test page"
# create remote at GitHub first, then add it here; replace the URL
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git
git branch -M main
git push -u origin main
```

2) Verify on GitHub
- Open your repository on GitHub, confirm files are present (e.g., `index.html`, `test.html`, `ping.txt`).

3) Publish on Hostinger — two common options

- Option A — Use Hostinger File Manager (quickest):
  - In hPanel, go to File Manager for your hosting account.
  - Upload the repository files to the `public_html` (or configured web root) folder.
  - Ensure `index.html` is in the web root. Visit `https://your-domain` and open `test.html` (e.g., `https://your-domain/test.html`).

- Option B — Deploy from Git (if your Hostinger plan supports Git deployment):
  - In hPanel, open the Git or Auto-deploy section and connect/clone your GitHub repo or configure deployment.
  - Set the deployment path to the web root (e.g., `public_html`).
  - Trigger a deploy and visit `https://your-domain/test.html`.

4) What to check on `test.html`
- Page loads in browser from your Hostinger URL.
- Click the **Run connectivity check** button: it should show `ping.txt -> pong` and a response from `github zen`.
- If `ping.txt` doesn't load, check that `ping.txt` exists in your web root and file permissions are correct.

Troubleshooting tips
- If you see a 404 when opening `test.html`, ensure files were uploaded to the correct directory (common mistake: upload into a subfolder).
- If `ping.txt` loads but the GitHub API fetch fails, that is likely a client-side network CORS/availability issue; static serving is still OK.
- If you're using an SFTP/FTP client (FileZilla / WinSCP), use the Hostinger FTP credentials from hPanel to upload files.

If you want, I can:
- create a `.github/workflows/ci.yml` to auto-deploy to GitHub Pages,
- or add a small script to help FTP-upload automatically.
