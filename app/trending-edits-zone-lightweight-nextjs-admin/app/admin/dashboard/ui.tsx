 "use client";

import { useEffect, useState } from "react";

type Post = {
  id: number; title: string; slug: string; category: string; type: string;
  status: string; featured: boolean; excerpt?: string; content?: string;
  cover_image?: string; external_url?: string; prompt_text?: string; alight_motion_url?: string;
};

const emptyPost = {
  title:"", slug:"", excerpt:"", content:"", category:"AI Prompts", type:"prompt",
  cover_image:"", external_url:"", prompt_text:"", alight_motion_url:"",
  status:"published", featured:false
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<any>(emptyPost);
  const [editing, setEditing] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/admin/posts");
    if (res.ok) setPosts(await res.json());
  }

  useEffect(() => { load(); }, []);

  function change(key: string, value: any) {
    setForm((old:any) => ({...old, [key]: value}));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const url = editing ? `/api/admin/posts/${editing}` : "/api/admin/posts";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Could not save");
    setMessage(editing ? "Post updated" : "Post created");
    setForm(emptyPost);
    setEditing(null);
    load();
  }

  async function remove(id:number) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/posts/${id}`, {method:"DELETE"});
    load();
  }

  async function logout() {
    await fetch("/api/admin/logout", {method:"POST"});
    location.href = "/admin/login";
  }

  return (
    <main style={{maxWidth:1100, margin:"30px auto", padding:20}}>
      <header style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <h1>Admin Dashboard</h1><button onClick={logout}>Logout</button>
      </header>

      <form onSubmit={save} style={{display:"grid", gap:10, border:"1px solid #ddd", padding:20}}>
        <h2>{editing ? "Edit Post" : "Create Post"}</h2>
        {["title","slug","excerpt","cover_image","external_url","alight_motion_url"].map(k =>
          <input key={k} value={form[k] || ""} onChange={e=>change(k,e.target.value)} placeholder={k} required={k==="title" || k==="slug"} />
        )}
        <select value={form.type} onChange={e=>change("type",e.target.value)}>
          <option value="prompt">AI Prompt</option><option value="alight-motion">Alight Motion</option><option value="tutorial">Tutorial</option>
        </select>
        <textarea value={form.prompt_text} onChange={e=>change("prompt_text",e.target.value)} placeholder="Prompt text" rows={6}/>
        <textarea value={form.content} onChange={e=>change("content",e.target.value)} placeholder="Post content" rows={6}/>
        <label><input type="checkbox" checked={form.featured} onChange={e=>change("featured",e.target.checked)}/> Featured</label>
        <button type="submit">{editing ? "Update Post" : "Create Post"}</button>
        {editing && <button type="button" onClick={()=>{setEditing(null);setForm(emptyPost)}}>Cancel Edit</button>}
        {message && <p>{message}</p>}
      </form>

      <h2>Posts</h2>
      <div style={{display:"grid", gap:10}}>
        {posts.map(p => <article key={p.id} style={{border:"1px solid #ddd", padding:15}}>
          <strong>{p.title}</strong><div>{p.slug} · {p.type} · {p.status}</div>
          <button onClick={()=>{setEditing(p.id);setForm({...emptyPost,...p})}}>Edit</button>{" "}
          <button onClick={()=>remove(p.id)}>Delete</button>
        </article>)}
      </div>
    </main>
  );
}
