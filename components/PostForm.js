"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PostForm({ initialData, postId }) {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    thumbnail: initialData?.thumbnail || "",
    category: initialData?.category?._id || initialData?.category || "",
    tags: initialData?.tags?.join(", ") || "",
    published: initialData?.published ?? true,
    trending: initialData?.trending ?? false,
    downloadLinks: initialData?.downloadLinks?.length
      ? initialData.downloadLinks
      : [{ label: "", url: "" }]
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
  }, []);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateLink(idx, field, value) {
    setForm((f) => {
      const links = [...f.downloadLinks];
      links[idx] = { ...links[idx], [field]: value };
      return { ...f, downloadLinks: links };
    });
  }

  function addLink() {
    setForm((f) => ({ ...f, downloadLinks: [...f.downloadLinks, { label: "", url: "" }] }));
  }

  function removeLink(idx) {
    setForm((f) => ({ ...f, downloadLinks: f.downloadLinks.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      downloadLinks: form.downloadLinks.filter((d) => d.label && d.url)
    };

    try {
      const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
      const method = postId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save post");
        return;
      }
      router.push("/admin/posts");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">
            Slug (URL) — leave blank to auto-generate from title
          </label>
          <input
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="e.g. alight-motion-preset-1456"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Category *</label>
          <select
            required
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            No categories yet? Create one on the Categories page first.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Thumbnail Image URL</label>
          <input
            value={form.thumbnail}
            onChange={(e) => update("thumbnail", e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <p className="text-xs text-gray-400 mt-1">
            Paste an image URL (e.g. from Cloudinary, Imgur, or your own storage).
          </p>
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Content (Markdown supported) *</label>
          <textarea
            required
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            rows={12}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-1">Tags (comma separated)</label>
          <input
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="alight motion, bgm, love"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Download Links</label>
          <div className="space-y-2">
            {form.downloadLinks.map((d, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  value={d.label}
                  onChange={(e) => updateLink(idx, "label", e.target.value)}
                  placeholder="Label e.g. Download Preset"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <input
                  value={d.url}
                  onChange={(e) => updateLink(idx, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-[2] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                />
                <button
                  type="button"
                  onClick={() => removeLink(idx)}
                  className="text-red-500 px-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addLink}
            className="text-sm text-brand hover:underline mt-2"
          >
            + Add another link
          </button>
        </div>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => update("published", e.target.checked)}
            />
            Published
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.trending}
              onChange={(e) => update("trending", e.target.checked)}
            />
            Mark as Trending
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-brand text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-dark disabled:opacity-60"
      >
        {saving ? "Saving..." : postId ? "Update Post" : "Publish Post"}
      </button>
    </form>
  );
}
