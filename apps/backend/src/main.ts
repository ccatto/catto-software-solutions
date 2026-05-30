// apps/backend/src/main.ts
// env.ts must be the FIRST import to load .env.local before any modules read process.env
import './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true, // Required for Stripe webhook signature verification
  });
  app.useLogger(app.get(Logger));

  // Enable CORS
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [process.env.CORS_ORIGIN || 'https://yourdomain.com']
        : ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true, // If you need to send cookies or auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
  });

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  app.get(Logger).log(`Server running at http://localhost:${port}`);
}
bootstrap();
