 "use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@tez.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Login failed");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <main style={{maxWidth: 420, margin: "80px auto", padding: 24}}>
      <h1>Trending Edits Zone</h1>
      <h2>Admin Login</h2>
      <form onSubmit={submit} style={{display:"grid", gap:12}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" required />
        <button type="submit">Login</button>
        {error && <p style={{color:"crimson"}}>{error}</p>}
      </form>
    </main>
  );
}
