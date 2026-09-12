import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/Category";

export const dynamic = "force-dynamic";

export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const trending = searchParams.get("trending");

  const filter = { published: true };
  if (category) {
    const Category = (await import("@/models/Category")).default;
    const cat = await Category.findOne({ slug: category });
    if (!cat) return NextResponse.json({ posts: [], total: 0 });
    filter.category = cat._id;
  }
  if (q) {
    filter.$text = { $search: q };
  }
  if (trending === "true") {
    filter.trending = true;
  }

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("category", "name slug")
    .lean();

  return NextResponse.json({ posts, total, page, limit });
}
