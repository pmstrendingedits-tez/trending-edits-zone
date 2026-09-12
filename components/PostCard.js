import Link from "next/link";
import Image from "next/image";

export default function PostCard({ post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="block bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
    >
      <div className="relative w-full aspect-video bg-gray-100">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl font-bold">
            {post.title?.[0] || "?"}
          </div>
        )}
      </div>
      <div className="p-4">
        {post.category?.name && (
          <span className="inline-block text-xs font-semibold text-brand bg-brand/10 px-2 py-1 rounded mb-2">
            {post.category.name}
          </span>
        )}
        <h3 className="font-bold text-base leading-snug line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {post.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
