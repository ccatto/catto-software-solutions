// apps/backend/src/auth/webauthn.service.ts
import {
  Injectable,
  Logger,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@src/prisma/prisma.service';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
} from '@simplewebauthn/types';

// In-memory challenge store with TTL
interface StoredChallenge {
  challenge: string;
  createdAt: number;
}

const CHALLENGE_TTL_MS = 5 * 60 * 1000; // 5 minutes

@Injectable()
export class WebAuthnService {
  private readonly logger = new Logger(WebAuthnService.name);
  private readonly challengeStore = new Map<string, StoredChallenge>();

  private readonly rpName: string;
  private readonly rpId: string;
  private readonly expectedOrigins: string[];

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.rpName = this.configService.get<string>(
      'WEBAUTHN_RP_NAME',
      'MyApp',
    );
    this.rpId = this.configService.get<string>('WEBAUTHN_RP_ID', 'localhost');
    const originStr = this.configService.get<string>(
      'WEBAUTHN_ORIGIN',
      'http://localhost:3000',
    );
    this.expectedOrigins = originStr.split(',').map((o) => o.trim());

    // Cleanup expired challenges every 10 minutes
    setInterval(() => this.cleanupExpiredChallenges(), 10 * 60 * 1000);
  }

  // --- Challenge management ---

  private storeChallenge(key: string, challenge: string): void {
    this.challengeStore.set(key, { challenge, createdAt: Date.now() });
  }

  private getAndRemoveChallenge(key: string): string | null {
    const stored = this.challengeStore.get(key);
    if (!stored) return null;
    this.challengeStore.delete(key);
    if (Date.now() - stored.createdAt > CHALLENGE_TTL_MS) return null;
    return stored.challenge;
  }

  private cleanupExpiredChallenges(): void {
    const now = Date.now();
    for (const [key, value] of this.challengeStore.entries()) {
      if (now - value.createdAt > CHALLENGE_TTL_MS) {
        this.challengeStore.delete(key);
      }
    }
  }

  // --- Registration ---

  async generateRegistrationOpts(
    userId: string,
    userEmail: string,
    userName: string | null,
  ) {
    const existingPasskeys = await this.prisma.client.passkey.findMany({
      where: { userId },
      select: { credentialId: true, transports: true },
    });

    // Ensure userName is never empty — WebAuthn spec requires user.name
    const effectiveUserName = userEmail || userId;
    const effectiveDisplayName = userName || userEmail || 'User';

    const options = await generateRegistrationOptions({
      rpName: this.rpName,
      rpID: this.rpId,
      userName: effectiveUserName,
      userDisplayName: effectiveDisplayName,
      attestationType: 'none',
      excludeCredentials: existingPasskeys.map((pk) => ({
        id: pk.credentialId,
        transports: pk.transports
          ? (pk.transports.split(',') as AuthenticatorTransportFuture[])
          : undefined,
      })),
      authenticatorSelection: {
        residentKey: 'preferred',
        userVerification: 'preferred',
        authenticatorAttachment: 'platform',
      },
    });

    this.storeChallenge(`reg:${userId}`, options.challenge);
    this.logger.log(`Generated registration options for user ${userId}`);
    return options;
  }

  async verifyRegistration(
    userId: string,
    responseJSON: RegistrationResponseJSON,
    friendlyName?: string,
  ) {
    const expectedChallenge = this.getAndRemoveChallenge(`reg:${userId}`);
    if (!expectedChallenge) {
      throw new BadRequestException(
        'Registration challenge expired or not found. Please try again.',
      );
    }

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: responseJSON,
        expectedChallenge,
        expectedOrigin: this.expectedOrigins,
        expectedRPID: this.rpId,
      });
    } catch (error) {
      this.logger.error(
        `Registration verification failed for user ${userId}: ${error.message}`,
      );
      throw new BadRequestException(
        'Passkey registration failed. Please try again.',
      );
    }

    if (!verification.verified || !verification.registrationInfo) {
      throw new BadRequestException(
        'Passkey registration could not be verified.',
      );
    }

    const { credential, credentialDeviceType, credentialBackedUp } =
      verification.registrationInfo;

    const passkey = await this.prisma.client.passkey.create({
      data: {
        userId,
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey).toString('base64url'),
        counter: BigInt(credential.counter),
        deviceType: credentialDeviceType,
        backedUp: credentialBackedUp,
        transports: credential.transports?.join(',') || null,
        friendlyName: friendlyName || null,
      },
    });

    this.logger.log(
      `Passkey registered for user ${userId}, passkeyId: ${passkey.id}`,
    );
    return {
      id: passkey.id,
      friendlyName: passkey.friendlyName,
      createdAt: passkey.createdAt,
    };
  }

  // --- Authentication ---

  async generateAuthenticationOpts(email?: string) {
    let allowCredentials: {
      id: string;
      transports?: AuthenticatorTransportFuture[];
    }[] = [];

    if (email) {
      const user = await this.prisma.client.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
          passkeys: { select: { credentialId: true, transports: true } },
        },
      });

      if (user?.passkeys) {
        allowCredentials = user.passkeys.map((pk) => ({
          id: pk.credentialId,
          transports: pk.transports
            ? (pk.transports.split(',') as AuthenticatorTransportFuture[])
            : undefined,
        }));
      }
    }

    const options = await generateAuthenticationOptions({
      rpID: this.rpId,
      allowCredentials,
      userVerification: 'preferred',
    });

    // Use the challenge as the session key (unique + random)
    const sessionId = options.challenge;
    this.storeChallenge(`auth:${sessionId}`, options.challenge);

    this.logger.log(
      `Generated authentication options${
        email ? ` for ${email}` : ' (discoverable)'
      }`,
    );
    return { options, sessionId };
  }

  async verifyAuthentication(
    sessionId: string,
    responseJSON: AuthenticationResponseJSON,
  ): Promise<string> {
    const expectedChallenge = this.getAndRemoveChallenge(`auth:${sessionId}`);
    if (!expectedChallenge) {
      throw new UnauthorizedException(
        'Authentication challenge expired or not found. Please try again.',
      );
    }

    const passkey = await this.prisma.client.passkey.findUnique({
      where: { credentialId: responseJSON.id },
    });

    if (!passkey) {
      throw new UnauthorizedException(
        'Passkey not recognized. Please register a passkey first.',
      );
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: responseJSON,
        expectedChallenge,
        expectedOrigin: this.expectedOrigins,
        expectedRPID: this.rpId,
        credential: {
          id: passkey.credentialId,
          publicKey: Buffer.from(passkey.publicKey, 'base64url'),
          counter: Number(passkey.counter),
          transports: passkey.transports
            ? (passkey.transports.split(',') as AuthenticatorTransportFuture[])
            : undefined,
        },
      });
    } catch (error) {
      this.logger.error(`Authentication verification failed: ${error.message}`);
      throw new UnauthorizedException('Passkey authentication failed.');
    }

    if (!verification.verified) {
      throw new UnauthorizedException(
        'Passkey authentication could not be verified.',
      );
    }

    // Update counter and lastUsedAt
    await this.prisma.client.passkey.update({
      where: { id: passkey.id },
      data: {
        counter: BigInt(verification.authenticationInfo.newCounter),
        lastUsedAt: new Date(),
      },
    });

    this.logger.log(`Passkey auth successful for user ${passkey.userId}`);
    return passkey.userId;
  }

  // --- Management ---

  async getPasskeysByUser(userId: string) {
    return this.prisma.client.passkey.findMany({
      where: { userId },
      select: {
        id: true,
        friendlyName: true,
        deviceType: true,
        backedUp: true,
        createdAt: true,
        lastUsedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deletePasskey(passkeyId: string, userId: string) {
    const passkey = await this.prisma.client.passkey.findFirst({
      where: { id: passkeyId, userId },
    });
    if (!passkey) {
      throw new BadRequestException('Passkey not found.');
    }
    await this.prisma.client.passkey.delete({ where: { id: passkeyId } });
    this.logger.log(`Passkey ${passkeyId} deleted for user ${userId}`);
  }

  async renamePasskey(passkeyId: string, userId: string, friendlyName: string) {
    const passkey = await this.prisma.client.passkey.findFirst({
      where: { id: passkeyId, userId },
    });
    if (!passkey) {
      throw new BadRequestException('Passkey not found.');
    }
    await this.prisma.client.passkey.update({
      where: { id: passkeyId },
      data: { friendlyName },
    });
  }
}
