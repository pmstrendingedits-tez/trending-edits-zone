import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Post from "@/models/Post";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  await connectDB();
  const { name } = await request.json();
  const slug = slugify(name, { lower: true, strict: true });
  const category = await Category.findByIdAndUpdate(
    params.id,
    { name, slug },
    { new: true, runValidators: true }
  );
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ category });
}

export async function DELETE(request, { params }) {
  await connectDB();
  const inUse = await Post.countDocuments({ category: params.id });
  if (inUse > 0) {
    return NextResponse.json(
      { error: `Cannot delete: ${inUse} post(s) use this category` },
      { status: 400 }
    );
  }
  const category = await Category.findByIdAndDelete(params.id);
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
