import { json } from "./_lib/response.js";
import { createSession, setSessionCookie } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return json(res, 405, { error: "Method not allowed" });

  try {
    const { username, password } = req.body || {};
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      return json(res, 500, { error: "Admin credentials are not configured" });
    }

    if (username !== validUsername || password !== validPassword) {
      return json(res, 401, { error: "Invalid username or password" });
    }

    setSessionCookie(res, createSession(username));
    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 500, { error: error.message });
  }
}
