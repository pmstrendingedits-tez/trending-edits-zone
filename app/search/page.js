import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/Category";

export const dynamic = "force-dynamic";

async function search(q) {
  await connectDB();
  if (!q) return [];
  const posts = await Post.find({
    published: true,
    $or: [
      { title: { $regex: q, $options: "i" } },
      { excerpt: { $regex: q, $options: "i" } },
      { tags: { $regex: q, $options: "i" } }
    ]
  })
    .sort({ createdAt: -1 })
    .populate("category", "name slug")
    .lean();
  return posts;
}

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q || "";
  const posts = await search(q);

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h1 className="text-xl font-bold mb-6">
            Search results for &ldquo;{q}&rdquo; ({posts.length})
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {posts.map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
            {posts.length === 0 && (
              <p className="text-gray-400 col-span-full">No posts found.</p>
            )}
          </div>
        </div>
        <Sidebar />
      </main>
      <Footer />
    </>
  );
}
