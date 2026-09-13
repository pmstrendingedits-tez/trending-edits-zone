import "./globals.css"; import type { Metadata } from "next";
export const metadata: Metadata={title:"Trending Edits Zone | AI Prompts & Editing Resources",description:"Discover AI image prompts, Alight Motion projects, editing tutorials and creative resources."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}