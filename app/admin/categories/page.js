"use client";

import { useEffect, useState } from "react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  async function load() {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to add category");
      return;
    }
    setName("");
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this category?")) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Failed to delete");
      return;
    }
    load();
  }

  function startEdit(c) {
    setEditingId(c._id);
    setEditingName(c.name);
  }

  async function saveEdit(id) {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editingName })
    });
    if (res.ok) {
      setEditingId(null);
      load();
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name e.g. Alight Motion"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
        />
        <button
          type="submit"
          className="bg-brand text-white font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark"
        >
          Add
        </button>
      </form>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {categories.map((c) => (
          <div key={c._id} className="flex items-center justify-between px-4 py-3">
            {editingId === c._id ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 mr-2"
              />
            ) : (
              <span className="font-medium">{c.name}</span>
            )}
            <div className="space-x-3 text-sm">
              {editingId === c._id ? (
                <>
                  <button onClick={() => saveEdit(c._id)} className="text-green-600 hover:underline">
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)} className="text-gray-400 hover:underline">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => startEdit(c)} className="text-brand hover:underline">
                    Rename
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-6 text-center text-gray-400 text-sm">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
