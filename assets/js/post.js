function esc(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function linkButton(label, url, style = "red") {
  if (!url) return "";
  const styles = style === "dark"
    ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
    : "bg-red-600 text-white hover:bg-red-500";
  return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${styles}">${esc(label)} ↗</a>`;
}

async function initPost() {
  const id = new URLSearchParams(location.search).get("id");
  const root = document.querySelector("#postRoot");
  if (!id) {
    root.innerHTML = `<p class="text-zinc-400">Post not found.</p>`;
    return;
  }

  try {
    const response = await fetch("/api/posts");
    const data = await response.json();
    const post = (data.posts || []).find(item => item.id === id && item.status !== "draft");
    if (!post) throw new Error("Post not found");

    document.title = `${post.title} | Trending Edits Zone`;
    const links = (post.links || []).map(item =>
      linkButton(item.label || "Open link", item.url, item.style === "dark" ? "dark" : "red")
    ).join("");

    root.innerHTML = `
      <article class="mx-auto max-w-4xl">
        <a href="/" class="text-sm text-red-400 hover:text-red-300">← Back to all assets</a>
        <div class="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04]">
          <img src="${esc(post.thumbnail || window.TEZ_CONFIG.defaultThumbnail)}" alt="${esc(post.title)}" class="max-h-[520px] w-full object-cover">
          <div class="p-6 md:p-10">
            <div class="flex flex-wrap gap-3 text-sm text-zinc-400">
              <span>${esc(post.category || "Editing Assets")}</span>
              <span>•</span>
              <span>${new Date(post.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
            <h1 class="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">${esc(post.title)}</h1>
            <p class="mt-6 whitespace-pre-line text-base leading-8 text-zinc-300">${esc(post.description || "")}</p>
            <div class="mt-8 flex flex-wrap gap-3">${links || '<span class="text-zinc-500">No links added.</span>'}</div>
            <div class="mt-8 flex flex-wrap gap-2">
              ${(post.tags || []).map(tag => `<span class="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300">#${esc(tag)}</span>`).join("")}
            </div>
          </div>
        </div>
      </article>
    `;
  } catch (error) {
    root.innerHTML = `<div class="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">Unable to load this post.</div>`;
  }
}
document.addEventListener("DOMContentLoaded", initPost);
