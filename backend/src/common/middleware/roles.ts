// src/common/middleware/roles.ts

import type { FastifyReply, FastifyRequest } from "fastify";

function hasAdminInPayload(u: any): boolean {
  if (!u) return false;
  if (u.is_admin === true) return true;
  if (String(u.role ?? "").toLowerCase() === "admin") return true;
  if (Array.isArray(u.roles) && u.roles.some((r: any) => String(r).toLowerCase() === "admin")) return true;
  return false;
}

/** Admin guard: JWT payload'ındaki is_admin / role / roles alanlarına göre kontrol eder. */
export async function requireAdmin(req: FastifyRequest, reply: FastifyReply) {
  const u = (req as any)?.user;
  if (hasAdminInPayload(u)) return;
  reply.code(403).send({ error: { message: "forbidden" } });
}
