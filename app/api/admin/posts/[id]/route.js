import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/Category";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  await connectDB();
  const post = await Post.findById(params.id).populate("category", "name slug").lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(request, { params }) {
  await connectDB();
  const body = await request.json();

  const update = {
    title: body.title,
    excerpt: body.excerpt || "",
    content: body.content,
    thumbnail: body.thumbnail || "",
    category: body.category,
    tags: body.tags || [],
    downloadLinks: body.downloadLinks || [],
    published: body.published !== undefined ? body.published : true,
    trending: body.trending || false
  };

  if (body.slug) {
    update.slug = slugify(body.slug, { lower: true, strict: true });
  }

  const post = await Post.findByIdAndUpdate(params.id, update, {
    new: true,
    runValidators: true
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function DELETE(request, { params }) {
  await connectDB();
  const post = await Post.findByIdAndDelete(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
