import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import type { FastifyInstance } from 'fastify';

import authPlugin from './plugins/authPlugin';
import mysqlPlugin from '@/plugins/mysql';
import staticUploads from './plugins/staticUploads';
import { localeMiddleware } from '@/common/middleware/locale';
import { env } from '@/core/env';
import { registerErrorHandlers } from '@/core/error';
import { parseCorsOrigins } from './app.helpers';
import { registerAllRoutes } from './routes';

import { shouldSkipAuditLog, writeRequestAuditLog } from '@agro/shared-backend/modules/audit';
import { startRetentionJob } from '@agro/shared-backend/modules/audit/service';

export async function createApp() {
  const { default: buildFastify } = (await import('fastify')) as unknown as {
    default: (opts?: Parameters<FastifyInstance['log']['child']>[0]) => FastifyInstance;
  };

  const app = buildFastify({
    logger: env.NODE_ENV !== 'production',
  }) as FastifyInstance;

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin: parseCorsOrigins(env.CORS_ORIGIN as any),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-lang',
      'Prefer',
      'Accept',
      'Accept-Language',
      'X-Locale',
      'x-skip-auth',
      'Range',
    ],
    exposedHeaders: ['x-total-count', 'content-range', 'range'],
  });

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'MOE Kompozit API',
        description: 'MOE Kompozit Backend API Documentation',
        version: '0.1.0',
      },
      servers: [{ url: `http://${process.env.HOST || 'localhost'}:${env.PORT}`, description: 'Local server' }],
      components: {
        securitySchemes: { apiKey: { type: 'apiKey', name: 'Authorization', in: 'header' } },
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(fastifySwaggerUi, {
    routePrefix: '/documentation',
    uiConfig: { docExpansion: 'list', deepLinking: false },
    staticCSP: true,
    transformStaticCSP: (header) => header.replace('style-src', "style-src 'unsafe-inline'"),
  });

  const cookieSecret =
    (globalThis as any).Bun?.env?.COOKIE_SECRET ?? process.env.COOKIE_SECRET ?? 'cookie-secret';

  await app.register(cookie, {
    secret: cookieSecret,
    hook: 'onRequest',
    parseOptions: {
      httpOnly: true,
      path: '/',
      sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: env.NODE_ENV === 'production',
    },
  });

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: 'access_token', signed: false },
  });

  app.addHook('onRequest', localeMiddleware);
  await app.register(authPlugin);
  await app.register(mysqlPlugin);

  app.get('/health', async () => ({ ok: true }));

  await app.register(multipart, {
    throwFileSizeLimit: true,
    limits: { fileSize: 20 * 1024 * 1024 },
  });

  await app.register(staticUploads);

  // Audit: tüm /api trafiğini logla
  app.addHook('onResponse', async (req, reply) => {
    try {
      if (shouldSkipAuditLog(req)) return;
      const reqId = String((req as any).id || (req as any).reqId || '');
      const elapsed = typeof (reply as any).elapsedTime === 'number' ? (reply as any).elapsedTime : 0;
      await writeRequestAuditLog({ req, reply, reqId, responseTimeMs: elapsed });
    } catch (err) {
      (req as any).log?.warn?.({ err }, 'audit_request_log_failed');
    }
  });

  await registerAllRoutes(app);

  registerErrorHandlers(app);
  startRetentionJob();

  return app;
}
