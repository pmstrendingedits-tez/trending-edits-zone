const $ = selector => document.querySelector(selector);
let posts = [];

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function addLinkRow(link = {}) {
  const row = document.createElement("div");
  row.className = "link-row grid gap-2 sm:grid-cols-[1fr_2fr_auto]";
  row.innerHTML = `
    <input class="link-label rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500" placeholder="Label" value="${escapeHTML(link.label || "")}">
    <input class="link-url rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-sm outline-none focus:border-red-500" placeholder="https://..." value="${escapeHTML(link.url || "")}">
    <button type="button" class="remove-link rounded-xl border border-white/10 px-3 py-2 text-sm hover:bg-white/5">Remove</button>
  `;
  row.querySelector(".remove-link").addEventListener("click", () => row.remove());
  $("#linksContainer").appendChild(row);
}

function getLinks() {
  return [...document.querySelectorAll(".link-row")].map(row => ({
    label: row.querySelector(".link-label").value.trim(),
    url: row.querySelector(".link-url").value.trim()
  })).filter(link => link.label && link.url);
}

function resetForm() {
  $("#postForm").reset();
  $("#postId").value = "";
  $("#formHeading").textContent = "Create post";
  $("#saveBtn").textContent = "Save post";
  $("#linksContainer").innerHTML = "";
  addLinkRow();
  $("#formMessage").textContent = "";
  $("#uploadMessage").textContent = "";
}

function fillForm(post) {
  $("#postId").value = post.id;
  $("#title").value = post.title || "";
  $("#category").value = post.category || "";
  $("#tags").value = (post.tags || []).join(", ");
  $("#description").value = post.description || "";
  $("#thumbnail").value = post.thumbnail || "";
  $("#status").value = post.status || "published";
  $("#formHeading").textContent = "Edit post";
  $("#saveBtn").textContent = "Update post";
  $("#linksContainer").innerHTML = "";
  (post.links || []).forEach(addLinkRow);
  if (!(post.links || []).length) addLinkRow();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAdminPosts() {
  const root = $("#adminPosts");
  if (!posts.length) {
    root.innerHTML = `<p class="text-sm text-zinc-500">No posts yet.</p>`;
    return;
  }
  root.innerHTML = posts.map(post => `
    <div class="rounded-xl border border-white/10 bg-zinc-900/60 p-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h3 class="font-bold">${escapeHTML(post.title)}</h3>
          <p class="mt-1 text-xs text-zinc-500">${escapeHTML(post.category || "")} · ${escapeHTML(post.status || "")}</p>
        </div>
        <div class="flex gap-2">
          <button data-edit="${escapeHTML(post.id)}" class="text-xs text-red-400 hover:text-red-300">Edit</button>
          <button data-delete="${escapeHTML(post.id)}" class="text-xs text-zinc-400 hover:text-white">Delete</button>
        </div>
      </div>
    </div>
  `).join("");

  root.querySelectorAll("[data-edit]").forEach(btn => {
    btn.addEventListener("click", () => fillForm(posts.find(p => p.id === btn.dataset.edit)));
  });
  root.querySelectorAll("[data-delete]").forEach(btn => {
    btn.addEventListener("click", async () => {
      if (!confirm("Delete this post permanently?")) return;
      try {
        await api(`/api/posts?id=${encodeURIComponent(btn.dataset.delete)}`, { method: "DELETE" });
        await loadPosts();
        resetForm();
      } catch (error) {
        alert(error.message);
      }
    });
  });
}

async function loadPosts() {
  const data = await api("/api/posts");
  posts = data.posts || [];
  renderAdminPosts();
}

async function checkSession() {
  try {
    await api("/api/session");
    $("#loginSection").classList.add("hidden");
    $("#dashboardSection").classList.remove("hidden");
    $("#logoutBtn").classList.remove("hidden");
    await loadPosts();
  } catch {
    $("#loginSection").classList.remove("hidden");
  }
}

$("#loginForm").addEventListener("submit", async event => {
  event.preventDefault();
  $("#loginMessage").textContent = "";
  try {
    await api("/api/login", {
      method: "POST",
      body: JSON.stringify({
        username: $("#username").value,
        password: $("#password").value
      })
    });
    await checkSession();
  } catch (error) {
    $("#loginMessage").textContent = error.message;
  }
});

$("#logoutBtn").addEventListener("click", async () => {
  await api("/api/logout", { method: "POST" });
  location.reload();
});

$("#addLinkBtn").addEventListener("click", () => addLinkRow());
$("#resetBtn").addEventListener("click", resetForm);
$("#refreshBtn").addEventListener("click", () => loadPosts().catch(e => alert(e.message)));

$("#imageFile").addEventListener("change", async event => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 8 * 1024 * 1024) {
    $("#uploadMessage").textContent = "Please choose an image below 8 MB.";
    return;
  }

  $("#uploadMessage").textContent = "Uploading image...";
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/api/upload-image", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Image upload failed");
    $("#thumbnail").value = data.url;
    $("#uploadMessage").textContent = "Image uploaded successfully.";
  } catch (error) {
    $("#uploadMessage").textContent = error.message;
  }
});

$("#postForm").addEventListener("submit", async event => {
  event.preventDefault();
  $("#formMessage").textContent = "Saving...";
  $("#formMessage").className = "text-sm text-zinc-400";

  const payload = {
    id: $("#postId").value || undefined,
    title: $("#title").value.trim(),
    category: $("#category").value.trim(),
    tags: $("#tags").value.split(",").map(x => x.trim()).filter(Boolean),
    description: $("#description").value.trim(),
    thumbnail: $("#thumbnail").value.trim(),
    links: getLinks(),
    status: $("#status").value
  };

  try {
    await api("/api/posts", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    $("#formMessage").textContent = "Post saved successfully.";
    $("#formMessage").className = "text-sm text-green-400";
    await loadPosts();
    resetForm();
  } catch (error) {
    $("#formMessage").textContent = error.message;
    $("#formMessage").className = "text-sm text-red-300";
  }
});

addLinkRow();
checkSession();
