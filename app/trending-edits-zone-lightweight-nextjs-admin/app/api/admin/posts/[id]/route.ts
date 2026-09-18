import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const p = await request.json();

  const rows = await sql`
    update posts set
      title=${p.title}, slug=${p.slug}, excerpt=${p.excerpt || ""}, content=${p.content || ""},
      category=${p.category || "AI Prompts"}, type=${p.type || "prompt"},
      cover_image=${p.cover_image || ""}, external_url=${p.external_url || ""},
      prompt_text=${p.prompt_text || ""}, alight_motion_url=${p.alight_motion_url || ""},
      status=${p.status || "published"}, featured=${Boolean(p.featured)}, updated_at=now()
    where id=${Number(id)}
    returning *
  `;
  return NextResponse.json(rows[0]);
}

export async function DELETE(_: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  await sql`delete from posts where id=${Number(id)}`;
  return NextResponse.json({ success: true });
}
