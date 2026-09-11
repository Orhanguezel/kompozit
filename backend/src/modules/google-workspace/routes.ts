import crypto from "node:crypto";
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { RowDataPacket } from "mysql2";

import { env } from "@/core/env";
import { pool } from "@/db/client";
import { getAuthUserId } from "@ensotek/shared-backend/modules/_shared";
import { getGoogleSettings } from "@ensotek/shared-backend/modules/siteSettings";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];
const CALLBACK = `${env.PUBLIC_URL.replace(/\/+$/, "")}/google-workspace/callback`;
const ADMIN_RETURN = "https://www.karbonkompozit.com.tr/admin/integrations";

type AccountRow = RowDataPacket & {
  id: string;
  owner_user_id: string;
  email: string;
  display_name: string | null;
  token_expiry: string | null;
  scopes: string | null;
  status: string;
  last_synced_at: string | null;
};

function key() {
  return crypto.createHash("sha256").update(env.JWT_SECRET).digest();
}

function encrypt(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const body = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), body].map((part) => part.toString("base64url")).join(".");
}

function stateFor(userId: string) {
  const body = Buffer.from(JSON.stringify({ userId, exp: Date.now() + 600_000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", env.JWT_SECRET).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function readState(value: string) {
  const [body, signature] = value.split(".");
  if (!body || !signature) throw new Error("invalid_state");
  const expected = crypto.createHmac("sha256", env.JWT_SECRET).update(body).digest();
  const actual = Buffer.from(signature, "base64url");
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) throw new Error("invalid_state");
  const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as { userId?: string; exp?: number };
  if (!payload.userId || !payload.exp || payload.exp < Date.now()) throw new Error("expired_state");
  return payload.userId;
}

async function credentials() {
  const value = await getGoogleSettings();
  if (!value.clientId || !value.clientSecret) throw new Error("google_oauth_not_configured");
  return { clientId: value.clientId, clientSecret: value.clientSecret };
}

export async function registerGoogleWorkspaceAdmin(app: FastifyInstance) {
  app.get("/google-workspace/accounts", async (req) => {
    const [rows] = await pool.query<AccountRow[]>(
      "SELECT id,email,display_name,token_expiry,scopes,status,last_synced_at FROM user_google_accounts WHERE owner_user_id=? ORDER BY updated_at DESC",
      [getAuthUserId(req)],
    );
    return rows;
  });

  app.get("/google-workspace/connect", async (req) => {
    const { clientId } = await credentials();
    const query = new URLSearchParams({
      client_id: clientId,
      redirect_uri: CALLBACK,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
      scope: SCOPES.join(" "),
      state: stateFor(getAuthUserId(req)),
    });
    return { url: `https://accounts.google.com/o/oauth2/v2/auth?${query}`, callback_url: CALLBACK };
  });

  app.delete<{ Params: { id: string } }>("/google-workspace/accounts/:id", async (req, reply) => {
    await pool.execute("DELETE FROM user_google_accounts WHERE id=? AND owner_user_id=?", [
      req.params.id,
      getAuthUserId(req),
    ]);
    return reply.code(204).send();
  });
}

export async function registerGoogleWorkspacePublic(app: FastifyInstance) {
  app.get(
    "/google-workspace/callback",
    async (req: FastifyRequest<{ Querystring: { code?: string; state?: string } }>, reply) => {
      try {
        if (!req.query.code || !req.query.state) throw new Error("missing_oauth_params");
        const owner = readState(req.query.state);
        const { clientId, clientSecret } = await credentials();
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: { "content-type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            code: req.query.code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: CALLBACK,
            grant_type: "authorization_code",
          }),
        });
        if (!tokenResponse.ok) throw new Error("google_token_exchange_failed");
        const token = (await tokenResponse.json()) as {
          access_token?: string;
          refresh_token?: string;
          expires_in?: number;
          scope?: string;
        };
        if (!token.access_token || !token.refresh_token) throw new Error("google_refresh_token_missing");
        const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: { authorization: `Bearer ${token.access_token}` },
        });
        if (!profileResponse.ok) throw new Error("google_profile_failed");
        const profile = (await profileResponse.json()) as { email?: string; name?: string };
        if (!profile.email) throw new Error("google_email_missing");
        await pool.execute(
          `INSERT INTO user_google_accounts
           (id,owner_user_id,email,display_name,enc_access_token,enc_refresh_token,token_expiry,scopes,status)
           VALUES (UUID(),?,?,?,?,?,?,?,'connected')
           ON DUPLICATE KEY UPDATE display_name=VALUES(display_name),enc_access_token=VALUES(enc_access_token),
             enc_refresh_token=VALUES(enc_refresh_token),token_expiry=VALUES(token_expiry),
             scopes=VALUES(scopes),status='connected',last_error=NULL`,
          [
            owner,
            profile.email,
            profile.name ?? null,
            encrypt(token.access_token),
            encrypt(token.refresh_token),
            token.expires_in ? new Date(Date.now() + token.expires_in * 1000) : null,
            token.scope ?? SCOPES.join(" "),
          ],
        );
        return reply.redirect(`${ADMIN_RETURN}?google=connected`);
      } catch (error) {
        req.log.error({ error }, "google_workspace_callback_failed");
        return reply.redirect(`${ADMIN_RETURN}?google=error`);
      }
    },
  );
}
