import Link from "next/link";
import SearchBox from "./SearchBox";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Trending Edits Zone";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 text-xs">
          <nav className="hidden sm:flex gap-4 text-gray-500">
            <Link href="/page/about-us" className="hover:text-brand">About Us</Link>
            <Link href="/page/contact-us" className="hover:text-brand">Contact Us</Link>
            <Link href="/page/privacy-policy" className="hover:text-brand">Privacy Policy</Link>
            <Link href="/page/terms-and-conditions" className="hover:text-brand">Terms &amp; Conditions</Link>
          </nav>
        </div>
        <div className="flex items-center justify-between py-4 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-lg">
              T
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              {siteName}
            </span>
          </Link>
          <SearchBox />
        </div>
      </div>
    </header>
  );
}
