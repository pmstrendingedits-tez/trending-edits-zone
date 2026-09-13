import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trending Edits Zone | AI Prompts, Presets & Editing Tutorials",
  description: "Discover AI image prompts, Alight Motion project links, editing resources and creative tutorials.",
  keywords: ["AI prompts", "Alight Motion", "editing tutorials", "photo editing", "video editing"]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}