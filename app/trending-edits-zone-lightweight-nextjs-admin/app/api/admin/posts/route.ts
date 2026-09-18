import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await sql`select * from posts order by created_at desc`;
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const p = await request.json();

  if (!p.title || !p.slug) {
    return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
  }

  const rows = await sql`
    insert into posts
    (title, slug, excerpt, content, category, type, cover_image, external_url, prompt_text, alight_motion_url, status, featured)
    values
    (${p.title}, ${p.slug}, ${p.excerpt || ""}, ${p.content || ""}, ${p.category || "AI Prompts"},
     ${p.type || "prompt"}, ${p.cover_image || ""}, ${p.external_url || ""}, ${p.prompt_text || ""},
     ${p.alight_motion_url || ""}, ${p.status || "published"}, ${Boolean(p.featured)})
    returning *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
