// Usage: npm run seed  (make sure MONGODB_URI is set in .env.local)
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const slugify = require("slugify");

const CategorySchema = new mongoose.Schema(
  { name: String, slug: String },
  { timestamps: true }
);
const PostSchema = new mongoose.Schema(
  {
    title: String,
    slug: String,
    excerpt: String,
    content: String,
    thumbnail: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [String],
    downloadLinks: [{ label: String, url: String }],
    published: Boolean,
    trending: Boolean,
    views: Number
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);

const categoryNames = [
  "Alight Motion",
  "Photo Edit",
  "BGM",
  "Reels & Status",
  "Lightroom",
  "Editz Materials"
];

const samplePosts = [
  {
    title: "Sample Alight Motion Preset 1 - Trending Intro",
    category: "Alight Motion",
    excerpt: "A trending Alight Motion preset intro edit. Replace with your own content.",
    content:
      "## How to use this preset\n\n1. Download the XML file below.\n2. Open Alight Motion and import it.\n3. Replace the media with your own clips.\n\nEnjoy editing!",
    thumbnail: "",
    tags: ["alight motion", "preset", "trending"],
    downloadLinks: [{ label: "Download XML", url: "https://example.com/sample.xml" }],
    trending: true
  },
  {
    title: "Sample Photo Edit Prompt - Cinematic Portrait",
    category: "Photo Edit",
    excerpt: "A cinematic AI photo editing prompt. Replace with your own content.",
    content:
      "### Prompt\n\n`Ultra-realistic cinematic portrait, golden hour lighting, shallow depth of field`\n\n**Steps:**\n1. Copy the prompt above.\n2. Paste it into your AI photo tool.\n3. Upload your original photo.",
    thumbnail: "",
    tags: ["photo edit", "ai prompt"],
    downloadLinks: [],
    trending: false
  },
  {
    title: "Sample BGM Pack - Emotional Reels Background Music",
    category: "BGM",
    excerpt: "A trending background music pack for reels. Replace with your own content.",
    content: "Download the BGM pack below and use it in your next reels edit.",
    thumbnail: "",
    tags: ["bgm", "reels"],
    downloadLinks: [{ label: "Download BGM", url: "https://example.com/sample-bgm.mp3" }],
    trending: true
  }
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI not set. Add it to .env.local first.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  const categoryMap = {};
  for (const name of categoryNames) {
    const slug = slugify(name, { lower: true, strict: true });
    let cat = await Category.findOne({ slug });
    if (!cat) {
      cat = await Category.create({ name, slug });
      console.log(`Created category: ${name}`);
    }
    categoryMap[name] = cat._id;
  }

  for (const p of samplePosts) {
    const slug = slugify(p.title, { lower: true, strict: true });
    const exists = await Post.findOne({ slug });
    if (exists) continue;
    await Post.create({
      title: p.title,
      slug,
      excerpt: p.excerpt,
      content: p.content,
      thumbnail: p.thumbnail,
      category: categoryMap[p.category],
      tags: p.tags,
      downloadLinks: p.downloadLinks,
      published: true,
      trending: p.trending,
      views: 0
    });
    console.log(`Created post: ${p.title}`);
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
