import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/Category";

export const dynamic = "force-dynamic";

async function getData() {
  await connectDB();
  const trending = await Post.find({ published: true, trending: true })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("category", "name slug")
    .lean();

  const latest = await Post.find({ published: true })
    .sort({ createdAt: -1 })
    .limit(12)
    .populate("category", "name slug")
    .lean();

  return { trending, latest };
}

export default async function HomePage() {
  const { trending, latest } = await getData();

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-10">
          {trending.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 border-l-4 border-brand pl-3">
                Trending
              </h2>
              <ul className="space-y-2">
                {trending.map((p) => (
                  <li key={p._id}>
                    <Link
                      href={`/post/${p.slug}`}
                      className="block bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-brand transition-colors font-medium"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold mb-4 border-l-4 border-brand pl-3">
              Read More
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {latest.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
              {latest.length === 0 && (
                <p className="text-gray-400 col-span-full">
                  No posts yet. Add your first post from the admin panel.
                </p>
              )}
            </div>
          </section>
        </div>
        <Sidebar />
      </main>
      <Footer />
    </>
  );
}
