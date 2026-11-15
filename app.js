// SenpaiWall — loads wallpapers.json, renders grids, handles search/filter/detail.
let ALL = [];
let activeDevice = "all";
const PAGE_SIZE = 12;
let currentPage = 1;

const $ = s => document.querySelector(s);

async function init() {
  const res = await fetch("wallpapers.json");
  ALL = await res.json();
  $("#stat-count").textContent = ALL.length;
  render();
  // Deep link: #w=ID opens that wallpaper
  const m = location.hash.match(/w=(\d+)/);
  if (m) { const w = ALL.find(x => x.id == m[1]); if (w) openModal(w); }
}

function matches(w) {
  if (activeDevice !== "all" && w.orientation !== activeDevice) return false;
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
  el.className = "card " + w.orientation.toLowerCase();
  el.innerHTML = `
    <img loading="lazy" decoding="async" src="${w.thumb || w.file}" alt="${w.title} — ${w.series} wallpaper">
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
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  if (currentPage > totalPages) currentPage = totalPages;
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = list.slice(start, start + PAGE_SIZE);
  const newestGrid = $("#grid-newest"), popularGrid = $("#grid-popular");
  newestGrid.innerHTML = ""; popularGrid.innerHTML = "";
  pageItems.forEach(w => newestGrid.appendChild(card(w)));
  popular.forEach(w => { if (!list.includes(w)) return; popularGrid.appendChild(card(w)); });
  $("#no-results").hidden = list.length > 0;
  $("#popular").style.display = popular.length ? "" : "none";
  renderPagination(list.length, totalPages, start);
}

function renderPagination(total, totalPages, start) {
  const nav = $("#pagination");
  if (!nav) return;
  nav.innerHTML = "";
  if (total <= PAGE_SIZE) return; // one page — no controls needed
  const info = document.createElement("span");
  info.className = "page-info";
  info.textContent = `Showing ${start + 1}–${Math.min(start + PAGE_SIZE, total)} of ${total}`;
  const prev = document.createElement("button");
  prev.textContent = "‹ Prev";
  prev.disabled = currentPage === 1;
  prev.addEventListener("click", () => goToPage(currentPage - 1));
  nav.appendChild(prev);
  for (let p = 1; p <= totalPages; p++) {
    const b = document.createElement("button");
    b.textContent = p;
    if (p === currentPage) b.className = "active";
    b.setAttribute("aria-current", p === currentPage ? "page" : "false");
    b.addEventListener("click", () => goToPage(p));
    nav.appendChild(b);
  }
  const next = document.createElement("button");
  next.textContent = "Next ›";
  next.disabled = currentPage === totalPages;
  next.addEventListener("click", () => goToPage(currentPage + 1));
  nav.appendChild(next);
  nav.appendChild(info);
}

function goToPage(p) {
  currentPage = p;
  render();
  document.querySelector("#newest").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openModal(w) {
  document.querySelector(".modal-card").classList.toggle("desktop", w.orientation === "Desktop");
  $("#modal-img").src = w.file;
  $("#modal-img").alt = `${w.title} — ${w.series} wallpaper`;
  $("#modal-title").textContent = `${w.title} #${w.id}`;
  $("#modal-meta").textContent = `${w.res} · ${w.width}×${w.height} · ${w.orientation} · Series: ${w.series} · Artist: ${w.artist}`;
  $("#modal-desc").textContent =
    w.orientation === "Desktop"
      ? `A ${w.res} desktop wallpaper — ${w.title}. Perfect as a wide 16:9 background for your monitor. ` +
        `Download the original ${w.width}×${w.height} file, free for personal use.`
      : `A ${w.res} ${w.orientation.toLowerCase()} wallpaper — ${w.title}. ` +
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
  $("#search").addEventListener("input", () => { currentPage = 1; render(); });
  $("#sort").addEventListener("change", () => { currentPage = 1; render(); });
  document.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
    c.classList.add("active"); activeDevice = c.dataset.device; currentPage = 1; render();
  }));
  document.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });
});
