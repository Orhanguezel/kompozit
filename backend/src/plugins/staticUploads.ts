// FILE: src/plugins/staticUploads.ts
import fp from 'fastify-plugin';
import fastifyStatic from '@fastify/static';
import path from 'node:path';
import type { FastifyInstance } from 'fastify';

export default fp(async (app: FastifyInstance) => {
  const uploadsDir = path.resolve(process.cwd(), 'uploads');

  app.register(fastifyStatic, {
    root: uploadsDir,
    prefix: '/uploads/', // https://www.ensotek.de/uploads/...
  });

  // Seed 316 / bazı kayıtlar: public URL `/media/kompozit/...` → disk `uploads/media/kompozit/...`
  app.register(fastifyStatic, {
    root: path.join(uploadsDir, 'media'),
    prefix: '/media/',
    decorateReply: false,
  });
});
