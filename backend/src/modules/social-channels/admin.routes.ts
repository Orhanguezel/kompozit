import { randomUUID } from "node:crypto";
import type { FastifyInstance } from "fastify";
import type { RowDataPacket } from "mysql2";
import { z } from "zod";
import { pool } from "@/db/client";
import { authorizationUrl, disconnect, livePosts, statuses, type SocialPlatform } from "./gateway";

const platformSchema = z.enum(["facebook", "instagram", "linkedin", "x"]);
const postSchema = z.object({
  title: z.string().trim().max(255).nullable().optional(),
  caption: z.string().trim().min(1).max(10000),
  media_url: z.string().trim().url().max(1000).nullable().optional(),
  link_url: z.string().trim().url().max(1000).nullable().optional(),
  scheduled_at: z.string().datetime().nullable().optional(),
});
type PostRow = RowDataPacket & {
  id: string; platform: SocialPlatform; title: string | null; caption: string; media_url: string | null;
  link_url: string | null; status: string; scheduled_at: string | null; created_at: string;
};

export async function registerSocialChannelsAdmin(app: FastifyInstance) {
  app.get("/social-oauth", async () => ({ items: await statuses() }));
  app.get<{ Params: { platform: string } }>("/social-oauth/:platform", async (req) => {
    const platform = platformSchema.parse(req.params.platform);
    const items = await statuses();
    return items.find((item) => item.platform === platform);
  });
  app.post<{ Params: { platform: string } }>("/social-oauth/:platform/start", async (req) =>
    authorizationUrl(platformSchema.parse(req.params.platform)),
  );
  app.delete<{ Params: { platform: string } }>("/social-oauth/:platform", async (req) =>
    disconnect(platformSchema.parse(req.params.platform)),
  );
  app.get<{ Params: { platform: string } }>("/social-oauth/:platform/posts", async (req) =>
    livePosts(platformSchema.parse(req.params.platform)),
  );
  app.get<{ Params: { platform: string } }>("/social-channels/:platform/posts", async (req) => {
    const platform = platformSchema.parse(req.params.platform);
    const [rows] = await pool.execute<PostRow[]>(
      "SELECT * FROM social_channel_posts WHERE platform=? ORDER BY created_at DESC LIMIT 100",
      [platform],
    );
    return { items: rows };
  });
  app.post<{ Params: { platform: string } }>("/social-channels/:platform/posts", async (req, reply) => {
    const platform = platformSchema.parse(req.params.platform);
    const body = postSchema.parse(req.body);
    const id = randomUUID();
    const status = body.scheduled_at ? "scheduled" : "draft";
    await pool.execute(
      `INSERT INTO social_channel_posts
       (id,platform,title,caption,media_url,link_url,status,scheduled_at)
       VALUES (?,?,?,?,?,?,?,?)`,
      [id, platform, body.title ?? null, body.caption, body.media_url ?? null, body.link_url ?? null, status, body.scheduled_at ?? null],
    );
    return reply.code(201).send({ id, status });
  });
}
