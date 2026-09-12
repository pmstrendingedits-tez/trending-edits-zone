"use client";

import { useEffect, useState } from "react";
import PostForm from "@/components/PostForm";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/posts/${id}`)
      .then((r) => r.json())
      .then((d) => setPost(d.post))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!post) return <p className="text-red-500">Post not found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <PostForm initialData={post} postId={id} />
    </div>
  );
}
