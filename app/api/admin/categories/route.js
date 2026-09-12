import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import slugify from "slugify";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  return NextResponse.json({ categories });
}

export async function POST(request) {
  await connectDB();
  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const slug = slugify(name, { lower: true, strict: true });

  const exists = await Category.findOne({ $or: [{ name }, { slug }] });
  if (exists) {
    return NextResponse.json({ error: "Category already exists" }, { status: 409 });
  }

  const category = await Category.create({ name, slug });
  return NextResponse.json({ category }, { status: 201 });
}
