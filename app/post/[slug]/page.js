import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/db";
import Post from "@/models/Post";
import "@/models/Category";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPost(slug) {
  await connectDB();
  const post = await Post.findOneAndUpdate(
    { slug, published: true },
    { $inc: { views: 1 } },
    { new: true }
  )
    .populate("category", "name slug")
    .lean();
  return post;
}

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.thumbnail ? [post.thumbnail] : []
    }
  };
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <article className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-6">
          {post.category?.name && (
            <Link
              href={`/category/${post.category.slug}`}
              className="inline-block text-xs font-semibold text-brand bg-brand/10 px-2 py-1 rounded mb-3"
            >
              {post.category.name}
            </Link>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-4">{post.title}</h1>

          {post.thumbnail && (
            <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          )}

          <div className="prose-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {post.downloadLinks?.length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="font-bold text-lg">Downloads</h3>
              {post.downloadLinks.map((d, i) => (
                <a
                  key={i}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-brand text-white text-center font-semibold rounded-lg py-3 hover:bg-brand-dark transition-colors"
                >
                  {d.label}
                </a>
              ))}
            </div>
          )}

          {post.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span key={t} className="text-xs bg-gray-100 px-3 py-1 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          )}

          <p className="text-xs text-gray-400 mt-6">{post.views} views</p>
        </article>
        <Sidebar />
      </main>
      <Footer />
    </>
  );
}
