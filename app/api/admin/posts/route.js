import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/Category";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("category", "name slug")
    .lean();
  return NextResponse.json({ posts });
}

export async function POST(request) {
  await connectDB();
  const body = await request.json();

  if (!body.title || !body.content || !body.category) {
    return NextResponse.json(
      { error: "title, content and category are required" },
      { status: 400 }
    );
  }

  let slug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : slugify(body.title, { lower: true, strict: true });

  const exists = await Post.findOne({ slug });
  if (exists) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  const post = await Post.create({
    title: body.title,
    slug,
    excerpt: body.excerpt || "",
    content: body.content,
    thumbnail: body.thumbnail || "",
    category: body.category,
    tags: body.tags || [],
    downloadLinks: body.downloadLinks || [],
    published: body.published !== undefined ? body.published : true,
    trending: body.trending || false
  });

  return NextResponse.json({ post }, { status: 201 });
}
