import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getData(slug) {
  await connectDB();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;
  const posts = await Post.find({ published: true, category: category._id })
    .sort({ createdAt: -1 })
    .populate("category", "name slug")
    .lean();
  return { category, posts };
}

export async function generateMetadata({ params }) {
  const data = await getData(params.slug);
  return { title: data ? data.category.name : "Category" };
}

export default async function CategoryPage({ params }) {
  const data = await getData(params.slug);
  if (!data) notFound();

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h1 className="text-2xl font-bold mb-6">{data.category.name}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {data.posts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
            {data.posts.length === 0 && (
              <p className="text-gray-400 col-span-full">No posts in this category yet.</p>
            )}
          </div>
        </div>
        <Sidebar />
      </main>
      <Footer />
    </>
  );
}
