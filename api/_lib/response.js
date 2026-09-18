export function json(res, status, payload) {
  res.status(status).setHeader("Content-Type", "application/json");
  return res.end(JSON.stringify(payload));
}
