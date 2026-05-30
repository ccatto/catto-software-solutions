// apps/backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { APP_PIPE, APP_GUARD } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
// import { GraphQLJSON } from 'graphql-scalars';
// ^ re-enable when a resolver uses @Field(() => GraphQLJSON), then add `resolvers: { JSON: GraphQLJSON }` below

import { GraphqlThrottlerGuard } from './common/guards/graphql-throttler.guard';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { GraphqlContextModule } from './graphql/graphql-context.module';
import { GraphqlContextService } from './graphql/graphql-context.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Optional @ccatto/* modules - uncomment as needed:
// import { CattoEmailModule } from '@ccatto/nest-email';
// import { CattoPaymentsModule } from '@ccatto/nest-payments';
// import { CattoPushModule } from '@ccatto/nest-push';
// import { CattoRecaptchaModule } from '@ccatto/nest-recaptcha';
// import { CattoSmsModule } from '@ccatto/nest-sms';

@Module({
  imports: [
    // Logging
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
      },
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute
      },
    ]),

    // GraphQL with Apollo Server
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [GraphqlContextModule],
      inject: [GraphqlContextService],
      useFactory: (contextService: GraphqlContextService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        // resolvers: { JSON: GraphQLJSON },  // re-enable when a resolver uses GraphQLJSON
        context: ({ req, connection }) => {
          if (connection) {
            return connection.context;
          }
          return contextService.createContext(req);
        },
      }),
    }),

    // Global config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Caching
    CacheModule.register({
      isGlobal: true,
      ttl: 5 * 60 * 1000, // Default TTL: 5 minutes
      max: 100, // Maximum number of items in cache
    }),

    // -------------------------------------------------------
    // Optional @ccatto/* modules - uncomment and configure:
    // -------------------------------------------------------
    // CattoEmailModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     apiKey: config.get('SENDGRID_API_KEY'),
    //     fromEmail: config.get('SENDGRID_FROM_EMAIL') || 'noreply@example.com',
    //   }),
    // }),
    // CattoPaymentsModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     secretKey: config.get('STRIPE_SECRET_KEY'),
    //     webhookSecret: config.get('STRIPE_WEBHOOK_SECRET'),
    //   }),
    // }),
    // CattoPushModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     firebaseServiceAccountJson: config.get('FIREBASE_SERVICE_ACCOUNT_JSON'),
    //   }),
    // }),
    // CattoRecaptchaModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     secretKey: config.get('RECAPTCHA_SECRET_KEY'),
    //     scoreThreshold: 0.5,
    //   }),
    // }),
    // CattoSmsModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     provider: 'telnyx' as const,
    //     apiKey: config.get('TELNYX_API_KEY'),
    //     phoneNumber: config.get('TELNYX_PHONE_NUMBER'),
    //     messagingProfileId: config.get('TELNYX_MESSAGING_PROFILE_ID'),
    //   }),
    // }),

    // Core infrastructure
    PrismaModule,
    AuthModule,

    // Feature modules (users kept as example)
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: GraphqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
