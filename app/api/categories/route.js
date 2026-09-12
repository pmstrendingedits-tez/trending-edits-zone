import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Post from "@/models/Post";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();

  const counts = await Post.aggregate([
    { $match: { published: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  const countMap = Object.fromEntries(
    counts.map((c) => [String(c._id), c.count])
  );

  const result = categories.map((c) => ({
    ...c,
    count: countMap[String(c._id)] || 0
  }));

  return NextResponse.json({ categories: result });
}
