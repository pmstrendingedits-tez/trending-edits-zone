import Link from "next/link";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Trending Edits Zone";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500">
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <Link href="/" className="hover:text-brand">Home</Link>
          <Link href="/page/about-us" className="hover:text-brand">About</Link>
          <Link href="/page/privacy-policy" className="hover:text-brand">Privacy Policy</Link>
          <Link href="/page/disclaimer" className="hover:text-brand">Disclaimer</Link>
          <Link href="/page/terms-and-conditions" className="hover:text-brand">Terms and Conditions</Link>
        </div>
        <p className="text-center">
          All Rights Reserved © {new Date().getFullYear()} {siteName}
        </p>
      </div>
    </footer>
  );
}
