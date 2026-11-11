// SenpaiWall — loads wallpapers.json, renders grids, handles search/filter/detail.
let ALL = [];
let activeTag = null;
let activeDevice = "all";

const $ = s => document.querySelector(s);

async function init() {
  const res = await fetch("wallpapers.json");
  ALL = await res.json();
  $("#stat-count").textContent = ALL.length;
  renderTags();
  render();
  // Deep link: #w=ID opens that wallpaper
  const m = location.hash.match(/w=(\d+)/);
  if (m) { const w = ALL.find(x => x.id == m[1]); if (w) openModal(w); }
}

function matches(w) {
  if (activeDevice !== "all" && w.orientation !== activeDevice) return false;
  if (activeTag && !w.tags.includes(activeTag)) return false;
  const q = $("#search").value.trim().toLowerCase();
  if (q) {
    const hay = (w.title + " " + w.series + " " + w.tags.join(" ")).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function sorted(list) {
  const mode = $("#sort").value;
  const byRes = w => w.width * w.height;
  if (mode === "popular") return [...list].sort((a, b) => b.views - a.views);
  if (mode === "res") return [...list].sort((a, b) => byRes(b) - byRes(a));
  return [...list].sort((a, b) => b.id - a.id); // newest = highest id first
}

function card(w) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <img loading="lazy" src="${w.file}" alt="${w.title} — ${w.series} wallpaper">
    <div class="card-body">
      <div class="card-title">${w.title}</div>
      <div class="card-meta">
        <span class="badge">${w.res}</span>
        <span>${w.width}×${w.height}</span>
        <span>#${w.id}</span>
        <span>${w.series}</span>
      </div>
    </div>`;
  el.addEventListener("click", () => openModal(w));
  return el;
}

function render() {
  const list = sorted(ALL.filter(matches));
  const popular = [...ALL.filter(matches)].sort((a, b) => b.views - a.views).slice(0, 8);
  const newestGrid = $("#grid-newest"), popularGrid = $("#grid-popular");
  newestGrid.innerHTML = ""; popularGrid.innerHTML = "";
  list.forEach(w => newestGrid.appendChild(card(w)));
  popular.forEach(w => { if (!list.includes(w)) return; popularGrid.appendChild(card(w)); });
  $("#no-results").hidden = list.length > 0;
  $("#popular").style.display = popular.length ? "" : "none";
}

function renderTags() {
  const counts = {};
  ALL.forEach(w => w.tags.forEach(t => counts[t] = (counts[t] || 0) + 1));
  const cloud = $("#tag-cloud");
  cloud.innerHTML = "";
  Object.entries(counts).sort((a, b) => b[1] - a[1]).forEach(([tag, n]) => {
    const b = document.createElement("button");
    b.className = "tag" + (activeTag === tag ? " active" : "");
    b.textContent = `${tag} · ${n}`;
    b.addEventListener("click", () => {
      activeTag = activeTag === tag ? null : tag;
      renderTags(); render();
    });
    cloud.appendChild(b);
  });
}

function openModal(w) {
  $("#modal-img").src = w.file;
  $("#modal-img").alt = `${w.title} — ${w.series} wallpaper`;
  $("#modal-title").textContent = `${w.title} #${w.id}`;
  $("#modal-meta").textContent = `${w.res} · ${w.width}×${w.height} · ${w.orientation} · Series: ${w.series} · Artist: ${w.artist}`;
  $("#modal-desc").textContent =
    `A ${w.res} ${w.orientation.toLowerCase()} wallpaper — ${w.title}. ` +
    `Perfect as a phone background: the composition leaves clean space at the top for your clock and at the bottom for your app dock. ` +
    `Download the original ${w.width}×${w.height} file, free for personal use.`;
  const tags = $("#modal-tags"); tags.innerHTML = "";
  w.tags.forEach(t => { const s = document.createElement("span"); s.className = "tag"; s.textContent = t; tags.appendChild(s); });
  const dl = $("#modal-download");
  dl.href = w.file; dl.setAttribute("download", w.file.split("/").pop());
  $("#modal-copy").onclick = () => {
    const url = location.origin + location.pathname + "#w=" + w.id;
    navigator.clipboard && navigator.clipboard.writeText(url);
    $("#modal-copy").textContent = "Link copied ✓";
    setTimeout(() => $("#modal-copy").textContent = "Copy page link", 1500);
  };
  $("#modal").hidden = false;
  history.replaceState(null, "", "#w=" + w.id);
}
function closeModal() { $("#modal").hidden = true; history.replaceState(null, "", location.pathname); }

document.addEventListener("DOMContentLoaded", () => {
  init();
  $("#search").addEventListener("input", render);
  $("#sort").addEventListener("change", render);
  document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    c.classList.add("active"); activeDevice = c.dataset.device; render();
  }));
  document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
});
