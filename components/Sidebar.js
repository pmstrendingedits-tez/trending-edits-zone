import Link from "next/link";
import { connectDB } from "@/lib/db";
import Category from "@/models/Category";
import Post from "@/models/Post";

async function getCategoriesWithCounts() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();
  const counts = await Post.aggregate([
    { $match: { published: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } }
  ]);
  const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
  return categories.map((c) => ({ ...c, count: countMap[String(c._id)] || 0 }));
}

export default async function Sidebar() {
  const categories = await getCategoriesWithCounts();

  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-bold text-lg mb-3">Labels</h3>
        <ul className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className="text-xs bg-gray-100 hover:bg-brand hover:text-white transition-colors px-3 py-1.5 rounded-full inline-block"
              >
                {c.name} ({c.count})
              </Link>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="text-sm text-gray-400">No categories yet.</li>
          )}
        </ul>
      </div>
    </aside>
  );
}
