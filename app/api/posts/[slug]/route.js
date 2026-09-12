import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  await connectDB();
  const post = await Post.findOneAndUpdate(
    { slug: params.slug, published: true },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("category", "name slug")
    .lean();

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  return NextResponse.json({ post });
}
