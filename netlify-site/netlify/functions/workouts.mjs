import { getStore } from "@netlify/blobs";

// Lets the calendar call this from GitHub Pages (or any other address).
// The passphrase check below is still what protects the data.
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "x-pass, content-type",
  "Access-Control-Max-Age": "86400"
};

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const pass = Netlify.env.get("SYNC_PASS");
  if (!pass || req.headers.get("x-pass") !== pass) return new Response("Unauthorized", { status: 401, headers: CORS });
  const store = getStore("winter-arc");
  if (req.method === "GET") return Response.json((await store.get("data", { type: "json" })) || {}, { headers: CORS });
  if (req.method === "PUT") {
    const body = await req.json();
    if (!body || typeof body.t !== "number" || typeof body.keys !== "object") return new Response("Bad request", { status: 400, headers: CORS });
    await store.setJSON("data", body);
    return Response.json({ ok: true }, { headers: CORS });
  }
  return new Response("Method not allowed", { status: 405, headers: CORS });
};

export const config = { path: "/api/workouts" };
