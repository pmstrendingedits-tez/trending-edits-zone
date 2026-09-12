import mongoose from "mongoose";

const DownloadLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, default: "" },
    content: { type: String, required: true }, // markdown
    thumbnail: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    tags: [{ type: String, trim: true }],
    downloadLinks: [DownloadLinkSchema],
    published: { type: Boolean, default: true },
    trending: { type: Boolean, default: false },
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

PostSchema.index({ title: "text", excerpt: "text", tags: "text" });

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
