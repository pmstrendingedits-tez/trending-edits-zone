const state = {
  posts: [],
  filtered: []
};

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function formatDate(value) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

function postCard(post) {
  const thumbnail = post.thumbnail || window.TEZ_CONFIG.defaultThumbnail;
  const tags = (post.tags || []).slice(0, 3).map(tag =>
    `<span class="rounded-full bg-red-500/10 px-2 py-1 text-xs text-red-300">${escapeHTML(tag)}</span>`
  ).join("");

  return `
    <article class="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl transition hover:-translate-y-1 hover:border-red-500/50">
      <a href="/post.html?id=${encodeURIComponent(post.id)}">
        <img src="${escapeHTML(thumbnail)}" alt="${escapeHTML(post.title)}" class="h-52 w-full object-cover" loading="lazy">
      </a>
      <div class="p-5">
        <div class="mb-3 flex items-center justify-between gap-3 text-xs text-zinc-400">
          <span>${escapeHTML(post.category || "Editing Assets")}</span>
          <span>${formatDate(post.createdAt)}</span>
        </div>
        <h2 class="line-clamp-2 text-xl font-bold text-white">
          <a href="/post.html?id=${encodeURIComponent(post.id)}" class="hover:text-red-400">${escapeHTML(post.title)}</a>
        </h2>
        <p class="line-clamp-3 mt-3 text-sm leading-6 text-zinc-400">${escapeHTML(post.description || "")}</p>
        <div class="mt-4 flex flex-wrap gap-2">${tags}</div>
        <a href="/post.html?id=${encodeURIComponent(post.id)}" class="mt-5 inline-flex text-sm font-semibold text-red-400 hover:text-red-300">View assets →</a>
      </div>
    </article>
  `;
}

function renderPosts() {
  const grid = document.querySelector("#postsGrid");
  const empty = document.querySelector("#emptyState");
  if (!grid) return;

  if (!state.filtered.length) {
    grid.innerHTML = "";
    empty?.classList.remove("hidden");
    return;
  }
  empty?.classList.add("hidden");
  grid.innerHTML = state.filtered.map(postCard).join("");
}

function applyFilters() {
  const search = (document.querySelector("#searchInput")?.value || "").toLowerCase().trim();
  const category = document.querySelector("#categoryFilter")?.value || "";

  state.filtered = state.posts.filter(post => {
    const haystack = [
      post.title, post.description, post.category,
      ...(post.tags || [])
    ].join(" ").toLowerCase();

    return (!search || haystack.includes(search)) &&
      (!category || post.category === category);
  });
  renderPosts();
}

async function loadPosts() {
  const response = await fetch("/api/posts");
  if (!response.ok) throw new Error("Unable to load posts");
  const data = await response.json();
  state.posts = (data.posts || []).filter(post => post.status !== "draft");
  state.filtered = [...state.posts];

  const categories = [...new Set(state.posts.map(p => p.category).filter(Boolean))].sort();
  const categoryFilter = document.querySelector("#categoryFilter");
  if (categoryFilter) {
    categoryFilter.innerHTML = `<option value="">All categories</option>` +
      categories.map(c => `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`).join("");
  }
  renderPosts();
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#searchInput")?.addEventListener("input", applyFilters);
  document.querySelector("#categoryFilter")?.addEventListener("change", applyFilters);
  loadPosts().catch(error => {
    document.querySelector("#loadingState")?.classList.add("hidden");
    document.querySelector("#errorState")?.classList.remove("hidden");
    console.error(error);
  }).finally(() => {
    document.querySelector("#loadingState")?.classList.add("hidden");
  });
});
