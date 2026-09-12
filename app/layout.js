import "./globals.css";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Trending Edits Zone";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://trending-edits-zone.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`
  },
  description:
    "Alight Motion Presets, XML, Lightroom DNG, Kinemaster templates, video editing BGM, photo editing prompts and tutorials.",
  openGraph: {
    title: siteName,
    siteName,
    type: "website"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
