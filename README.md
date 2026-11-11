# SenpaiWall — Anime / Waifu Wallpaper Site

A static wallpaper site in the style of waifuwall.com: hero + search, trending tags,
Popular and Newest grids, and a detail view per wallpaper with a download button.
No build step, no server — plain HTML/CSS/JS, hosted free on Cloudflare Pages from GitHub.

## How it works
- `index.html` / `style.css` / `app.js` — the site
- `wallpapers.json` — the catalogue. One entry per wallpaper: title, file, size, tags, series, artist
- `wallpapers/` — the image files

## Add a new wallpaper
1. Drop the image into `wallpapers/`
2. Add an entry to `wallpapers.json` (copy an existing one, change id/title/file/tags)
3. Commit + push — Cloudflare redeploys automatically in ~1 minute

Tip: keep each image under 25 MB (Cloudflare Pages per-file limit). Phone wallpapers
at JPG quality 85 are usually 300 KB – 1 MB.

## Deploy — GitHub + Cloudflare Pages

### 1. GitHub
1. Sign in at https://github.com (create a free account if needed)
2. New repository → name it `senpai-wall` → Public → Create (no README needed, this folder has one)
3. Push this folder:
   ```
   git remote add origin https://github.com/<YOUR-USERNAME>/senpai-wall.git
   git push -u origin main
   ```

### 2. Cloudflare Pages
1. Sign up free at https://dash.cloudflare.com (no credit card)
2. Workers & Pages → Create application → Pages → Connect to Git
3. Authorize GitHub and select the `senpai-wall` repo (selected repositories only)
4. Build settings:
   - Framework preset: **None**
   - Build command: **(leave empty)**
   - Build output directory: **/** (repo root)
5. Save and Deploy → live at `https://senpai-wall.pages.dev` in 1–2 minutes
6. Every later `git push` auto-deploys. Optional: Custom domains tab to attach your own domain.

Free tier (checked Nov 2026): unlimited static requests/bandwidth, 500 builds/month,
20,000 files per site, 25 MB max per file.
