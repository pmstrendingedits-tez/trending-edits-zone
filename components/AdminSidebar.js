"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/posts/new", label: "New Post" },
  { href: "/admin/categories", label: "Categories" }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-56 shrink-0 bg-gray-900 text-gray-200 min-h-screen p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold">
          T
        </div>
        <span className="font-bold">TEZ Admin</span>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`block px-3 py-2 rounded-lg text-sm ${
              pathname === l.href
                ? "bg-brand text-white"
                : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="space-y-1">
        <Link
          href="/"
          target="_blank"
          className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-800 text-gray-300"
        >
          View Site ↗
        </Link>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-800 text-red-400"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
