// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { CattoAuthModule } from '@ccatto/nest-auth';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { WebAuthnService } from './webauthn.service';
import { UsersModule } from '@src/modules/users/users.module';
import { PrismaModule } from '@src/prisma/prisma.module';
import { PrismaService } from '@src/prisma/prisma.service';

@Module({
  imports: [
    CattoAuthModule.forRoot({
      jwt: { secret: process.env.JWT_SECRET! },
      prismaToken: PrismaService,
      imports: [PrismaModule],
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthResolver, WebAuthnService],
  exports: [AuthService],
})
export class AuthModule {}
