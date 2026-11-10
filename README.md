# YumeWall — Anime Wallpaper Gallery

A responsive, dark anime wallpaper gallery starter built with plain HTML, CSS and JavaScript. No build tools, database, paid hosting or framework required.

## Features
- Responsive anime-art gallery layout
- Search by title, series, artist and tags
- Category filters and sorting
- Wallpaper detail modal and download action
- Saved/favorite toggle (browser session only)
- Collections, mobile navigation and light theme toggle
- SEO metadata, Open Graph tags and basic structured data
- Easy-to-edit wallpaper data in `app.js`

## Preview locally
Open `index.html` in a browser. For a local server, run:
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Add your wallpapers
1. Create `assets/wallpapers/` in the repository.
2. Upload images you created or have permission to distribute.
3. Open `app.js` and add an object to the `wallpapers` array.
4. Set its `image` field to the image path, for example `assets/wallpapers/my-wallpaper.jpg`.
5. Add a descriptive title, artist credit, category, tags, resolution and description.
6. Commit the changes. The gallery updates automatically.

The `data/wallpapers.json` file is an example data format; the current front end uses the array in `app.js` so it can run without a fetch/server requirement.

## Deploy free with Cloudflare Pages
1. In Cloudflare Dashboard, open **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Connect GitHub and select `anime-wallpaper`.
3. Framework preset: **None**.
4. Build command: leave empty.
5. Build output directory: `/`.
6. Deploy. Cloudflare will provide a `.pages.dev` address.
   
Alternatively, use **Direct Upload** and upload the project files.

## Before public launch
- Replace the demo name, email and canonical URL in `index.html`.
- Add your own artwork; the current cards are CSS placeholders, not downloadable image files.
- Replace the example artist credit and descriptions.
- Add a real privacy policy and contact address if you add analytics, advertising or user submissions.
- Add `sitemap.xml` with your final domain.
- Do not upload copyrighted anime art unless you have the necessary rights or permission. Credit alone does not grant distribution rights.

## Important limitations
This starter is a static front end. It does not yet have user accounts, server-side uploads, moderation, a database, analytics, or an admin dashboard. Downloads are enabled once each wallpaper object has a valid image URL.
