import { json } from "./_lib/response.js";
import { getSession } from "./_lib/auth.js";

export const config = {
  api: {
    bodyParser: false
  }
};

async function readMultipart(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
  if (!getSession(req)) return json(res, 401, { error: "Unauthorized" });

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) {
    return json(res, 500, { error: "Cloudinary environment variables are not configured" });
  }

  try {
    const contentType = req.headers["content-type"] || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return json(res, 400, { error: "Use multipart/form-data" });
    }

    const body = await readMultipart(req);
    const boundaryMatch = contentType.match(/boundary=([^;]+)/);
    if (!boundaryMatch) return json(res, 400, { error: "Missing multipart boundary" });

    const boundary = Buffer.from(`--${boundaryMatch[1]}`);
    const parts = [];
    let start = 0;
    while ((start = body.indexOf(boundary, start)) !== -1) {
      const next = body.indexOf(boundary, start + boundary.length);
      if (next === -1) break;
      parts.push(body.slice(start + boundary.length, next));
      start = next;
    }

    const filePart = parts.find(part => part.includes(Buffer.from('name="file"')));
    if (!filePart) return json(res, 400, { error: "Image file is missing" });

    const headerEnd = filePart.indexOf(Buffer.from("\r\n\r\n"));
    if (headerEnd === -1) return json(res, 400, { error: "Invalid multipart data" });

    let fileBuffer = filePart.slice(headerEnd + 4);
    if (fileBuffer.slice(-2).toString() === "\r\n") fileBuffer = fileBuffer.slice(0, -2);

    const form = new FormData();
    form.append("file", new Blob([fileBuffer]), "upload-image");
    form.append("upload_preset", uploadPreset);

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      { method: "POST", body: form }
    );
    const result = await cloudinaryResponse.json();
    if (!cloudinaryResponse.ok) {
      return json(res, 400, { error: result.error?.message || "Cloudinary upload failed" });
    }

    return json(res, 200, { url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error(error);
    return json(res, 500, { error: "Image upload failed" });
  }
}
