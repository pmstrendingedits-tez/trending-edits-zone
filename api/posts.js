import { json } from "./_lib/response.js";
import { getSession } from "./_lib/auth.js";
import { readPosts, writePosts } from "./_lib/github.js";
import crypto from "node:crypto";

function validUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function sanitizePost(input, existing = {}) {
  const title = String(input.title || "").trim();
  const description = String(input.description || "").trim();
  const category = String(input.category || "Editing Assets").trim();

  if (!title || !description) throw new Error("Title and description are required");

  const links = Array.isArray(input.links) ? input.links.map(link => ({
    label: String(link.label || "").trim().slice(0, 80),
    url: String(link.url || "").trim()
  })).filter(link => link.label && validUrl(link.url)) : [];

  const thumbnail = String(input.thumbnail || "").trim();
  if (thumbnail && !validUrl(thumbnail)) throw new Error("Thumbnail must be a valid http/https URL");

  return {
    id: existing.id || input.id || crypto.randomUUID(),
    title: title.slice(0, 180),
    description: description.slice(0, 10000),
    category: category.slice(0, 80),
    tags: Array.isArray(input.tags)
      ? input.tags.map(tag => String(tag).trim().slice(0, 40)).filter(Boolean).slice(0, 20)
      : [],
    thumbnail,
    links: links.slice(0, 30),
    status: input.status === "draft" ? "draft" : "published",
    createdAt: existing.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const data = await readPosts();
      return json(res, 200, { posts: data.posts });
    }

    if (!getSession(req)) return json(res, 401, { error: "Unauthorized" });

    if (req.method === "POST") {
      const data = await readPosts();
      const input = req.body || {};
      const index = input.id ? data.posts.findIndex(post => post.id === input.id) : -1;

      if (index >= 0) {
        data.posts[index] = sanitizePost(input, data.posts[index]);
      } else {
        data.posts.unshift(sanitizePost(input));
      }

      await writePosts(data.posts, data.sha);
      return json(res, 200, { ok: true, posts: data.posts });
    }

    if (req.method === "DELETE") {
      const id = String(req.query.id || "");
      if (!id) return json(res, 400, { error: "Post ID is required" });

      const data = await readPosts();
      const next = data.posts.filter(post => post.id !== id);
      if (next.length === data.posts.length) return json(res, 404, { error: "Post not found" });

      await writePosts(next, data.sha);
      return json(res, 200, { ok: true, posts: next });
    }

    return json(res, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: error.message || "Server error" });
  }
}
