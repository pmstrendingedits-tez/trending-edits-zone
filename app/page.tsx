import { ArrowRight, BookOpen, Clapperboard, Image as ImageIcon, Sparkles, Zap } from "lucide-react";

const posts = [
  {
    category: "AI Prompts",
    title: "Cinematic Portrait Prompt Pack",
    description: "Create premium cinematic portraits with realistic skin, dramatic lighting and professional camera details.",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1000&q=85",
    tag: "Featured"
  },
  {
    category: "Alight Motion",
    title: "Velocity Shake Project Template",
    description: "Use this energetic velocity edit project for reels, status videos and trending transitions.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=85",
    tag: "Popular"
  },
  {
    category: "Photo Editing",
    title: "Luxury Poster Design Workflow",
    description: "A practical workflow for building clean, modern and high-impact social media posters.",
    image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1000&q=85",
    tag: "New"
  }
];

const categories = [
  { icon: Sparkles, title: "AI Prompts", count: "120+ resources" },
  { icon: Clapperboard, title: "Alight Motion", count: "80+ projects" },
  { icon: ImageIcon, title: "Photo Editing", count: "60+ tutorials" },
  { icon: BookOpen, title: "Video Editing", count: "40+ guides" }
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 shadow-glow">
            <Zap className="h-5 w-5 text-white" fill="white" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight">TRENDING</div>
            <div className="-mt-1 text-xs font-bold tracking-[.32em] text-cyan-300">EDITS ZONE</div>
          </div>
        </div>
        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a className="transition hover:text-white" href="#home">Home</a>
          <a className="transition hover:text-white" href="#resources">Resources</a>
          <a className="transition hover:text-white" href="#categories">Categories</a>
          <a className="transition hover:text-white" href="#about">About</a>
        </div>
        <a href="#resources" className="rounded-full border border-violet-400/40 bg-violet-500/15 px-4 py-2 text-sm font-bold text-violet-200 transition hover:bg-violet-500/30">
          Explore now
        </a>
      </nav>

      <section id="home" className="grid-bg relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pb-32 lg:pt-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-cyan-200">
              <Sparkles className="h-4 w-4" /> Create. Edit. Inspire.
            </div>
            <h1 className="max-w-3xl text-5xl font-black leading-[1.04] tracking-[-.05em] sm:text-6xl lg:text-7xl">
              Your creative world of <span className="gradient-text">trending edits.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              Discover powerful AI prompts, Alight Motion project links, editing tutorials and creative resources made for modern creators.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#resources" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-200">
                Browse resources <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#categories" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                View categories
              </a>
            </div>
            <div className="mt-10 flex gap-8 text-sm">
              <div><div className="text-2xl font-black">300+</div><div className="text-slate-400">Resources</div></div>
              <div><div className="text-2xl font-black">4</div><div className="text-slate-400">Creative zones</div></div>
              <div><div className="text-2xl font-black">100%</div><div className="text-slate-400">Creator focused</div></div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-r from-violet-600/30 to-cyan-400/20 blur-3xl" />
            <div className="glass relative overflow-hidden rounded-[2rem] p-3 shadow-glow">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=90"
                  alt="Abstract creative digital artwork"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="text-xs font-bold uppercase tracking-[.25em] text-cyan-200">Trending creator kit</p>
                  <h2 className="mt-2 text-3xl font-black">Turn ideas into visual stories.</h2>
                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Updated weekly with fresh resources
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.25em] text-violet-300">Explore the zone</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Everything creators need</h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ icon: Icon, title, count }) => (
            <div key={title} className="glass card-hover rounded-3xl p-6">
              <div className="mb-8 grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-cyan-300">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-slate-400">{count}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="resources" className="mx-auto max-w-7xl px-5 pb-24 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[.25em] text-cyan-300">Latest resources</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Fresh from the edit desk</h2>
          </div>
          <button className="text-left text-sm font-bold text-violet-300 transition hover:text-white sm:text-right">View all posts →</button>
        </div>
        <div className="grid gap-7 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="glass card-hover overflow-hidden rounded-3xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                <div className="absolute left-4 top-4 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-bold text-white backdrop-blur">{post.tag}</div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-300">{post.category}</p>
                <h3 className="mt-3 text-xl font-black">{post.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{post.description}</p>
                <a href="#" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white hover:text-cyan-300">
                  Read tutorial <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-12 sm:flex-row sm:items-center lg:px-8">
          <div>
            <div className="text-lg font-black">TRENDING EDITS ZONE</div>
            <p className="mt-2 text-sm text-slate-400">AI prompts, editing resources and inspiration for every creator.</p>
          </div>
          <p className="text-sm text-slate-500">© 2026 Trending Edits Zone. All rights reserved.</p>
        </div>
      </section>
    </main>
  );
}