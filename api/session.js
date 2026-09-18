import { json } from "./_lib/response.js";
import { getSession } from "./_lib/auth.js";

export default async function handler(req, res) {
  const session = getSession(req);
  if (!session) return json(res, 401, { error: "Not logged in" });
  return json(res, 200, { authenticated: true, username: session.username });
}
