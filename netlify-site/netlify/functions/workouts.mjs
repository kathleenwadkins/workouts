import { getStore } from "@netlify/blobs";

export default async (req) => {
  const pass = Netlify.env.get("SYNC_PASS");
  if (!pass || req.headers.get("x-pass") !== pass) return new Response("Unauthorized", { status: 401 });
  const store = getStore("winter-arc");
  if (req.method === "GET") return Response.json((await store.get("data", { type: "json" })) || {});
  if (req.method === "PUT") {
    const body = await req.json();
    if (!body || typeof body.t !== "number" || typeof body.keys !== "object") return new Response("Bad request", { status: 400 });
    await store.setJSON("data", body);
    return Response.json({ ok: true });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/workouts" };
