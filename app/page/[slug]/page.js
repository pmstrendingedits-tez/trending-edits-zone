import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { staticPages } from "@/lib/staticPages";
import { notFound } from "next/navigation";

export function generateMetadata({ params }) {
  const page = staticPages[params.slug];
  return { title: page ? page.title : "Page not found" };
}

export default function StaticPage({ params }) {
  const page = staticPages[params.slug];
  if (!page) notFound();

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">{page.title}</h1>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {page.content}
        </p>
      </main>
      <Footer />
    </>
  );
}
