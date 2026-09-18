# Trending Edits Zone

A beginner-friendly asset blog built with:

- HTML, Tailwind CSS CDN, and JavaScript
- Vercel static hosting
- Vercel Serverless Functions
- GitHub `posts.json` storage through GitHub API
- Cloudinary image hosting
- Environment-variable-based admin authentication

## Project structure

```text
trending-edits-zone/
├── index.html
├── post.html
├── admin/
│   ├── index.html
│   └── admin.js
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── config.js
│       ├── blog.js
│       └── post.js
├── api/
│   ├── posts.js
│   ├── login.js
│   ├── logout.js
│   ├── session.js
│   ├── upload-image.js
│   └── _lib/
│       ├── auth.js
│       ├── github.js
│       └── response.js
├── data/posts.json
├── .env.example
├── .gitignore
└── vercel.json
```

## Local setup

1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Open Terminal.
4. Run:

```bash
npm install -g vercel
vercel dev
```

5. Open the local URL shown by Vercel.

> Do not open `index.html` by double-clicking it. Use `vercel dev`, because the frontend calls `/api/...` serverless functions.

## GitHub setup

Create a private or public repository and upload all files.

The backend updates a file named `posts.json` in your GitHub repository. The default location is the repository root.

## Vercel environment variables

In Vercel → Project → Settings → Environment Variables, add:

```text
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=use-a-long-random-password
SESSION_SECRET=use-at-least-32-random-characters
GITHUB_TOKEN=your-github-fine-grained-token
GITHUB_OWNER=pmstrendingedits-tez
GITHUB_REPO=trending-edits-zone
GITHUB_BRANCH=main
GITHUB_POSTS_PATH=posts.json
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_UPLOAD_PRESET=your-unsigned-upload-preset
```

`GITHUB_TOKEN` should have access only to this repository and Contents: Read and write.

## Cloudinary setup

1. Create a Cloudinary account.
2. Open Settings → Upload.
3. Create an unsigned upload preset.
4. Set the preset name in `CLOUDINARY_UPLOAD_PRESET`.
5. Set your cloud name in `CLOUDINARY_CLOUD_NAME`.

The browser uploads the image to `/api/upload-image`; the serverless function forwards it to Cloudinary. The Cloudinary API secret is not needed for this unsigned upload flow and must never be placed in frontend code.

## GitHub token setup

Use a fine-grained personal access token:

- Repository access: Only the `trending-edits-zone` repository
- Repository permissions:
  - Contents: Read and write

Never put this token in HTML, JavaScript, or GitHub commits.

## Important security notes

- The admin page is not a substitute for server-side authentication. All write operations are protected by the serverless functions.
- Use a long unique admin password and session secret.
- Do not commit `.env`, tokens, or passwords.
- For production, enable 2FA on GitHub, Vercel, and Cloudinary.
