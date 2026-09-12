import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import Category from "@/models/Category";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectDB();
  const [totalPosts, published, categories, topViewed] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ published: true }),
    Category.countDocuments(),
    Post.find().sort({ views: -1 }).limit(5).lean()
  ]);
  return { totalPosts, published, categories, topViewed };
}

export default async function DashboardPage() {
  const { totalPosts, published, categories, topViewed } = await getStats();

  const cards = [
    { label: "Total Posts", value: totalPosts },
    { label: "Published", value: published },
    { label: "Drafts", value: totalPosts - published },
    { label: "Categories", value: categories }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-3xl font-extrabold text-brand">{c.value}</p>
            <p className="text-sm text-gray-500 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold mb-4">Most Viewed Posts</h2>
        <ul className="divide-y divide-gray-100">
          {topViewed.map((p) => (
            <li key={p._id} className="py-2 flex justify-between text-sm">
              <Link href={`/admin/posts/${p._id}/edit`} className="hover:text-brand">
                {p.title}
              </Link>
              <span className="text-gray-400">{p.views} views</span>
            </li>
          ))}
          {topViewed.length === 0 && (
            <li className="py-2 text-sm text-gray-400">No posts yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
