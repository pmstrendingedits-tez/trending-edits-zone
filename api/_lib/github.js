const apiBase = "https://api.github.com";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function config() {
  return {
    token: required("GITHUB_TOKEN"),
    owner: required("GITHUB_OWNER"),
    repo: required("GITHUB_REPO"),
    branch: process.env.GITHUB_BRANCH || "main",
    path: process.env.GITHUB_POSTS_PATH || "posts.json"
  };
}

async function githubRequest(url, options = {}) {
  const cfg = config();
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${cfg.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `GitHub API error: ${response.status}`);
  }
  return data;
}

function fileUrl() {
  const cfg = config();
  return `${apiBase}/repos/${cfg.owner}/${cfg.repo}/contents/${cfg.path}`;
}

export async function readPosts() {
  const cfg = config();
  try {
    const data = await githubRequest(`${fileUrl()}?ref=${encodeURIComponent(cfg.branch)}`);
    const content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString("utf8");
    return { posts: JSON.parse(content || "[]"), sha: data.sha };
  } catch (error) {
    if (String(error.message).includes("Not Found")) {
      return { posts: [], sha: null };
    }
    throw error;
  }
}

export async function writePosts(posts, sha) {
  const cfg = config();
  const body = {
    message: `Update blog posts - ${new Date().toISOString()}`,
    content: Buffer.from(JSON.stringify(posts, null, 2) + "\n").toString("base64"),
    branch: cfg.branch
  };
  if (sha) body.sha = sha;
  return githubRequest(fileUrl(), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}
