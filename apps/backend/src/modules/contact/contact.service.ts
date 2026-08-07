import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CattoSmsService } from '@ccatto/nest-sms';
import { CattoRecaptchaService } from '@ccatto/nest-recaptcha';
import { PrismaService } from '@src/prisma/prisma.service';
import { CreateContactMessageInput } from './dto/create-contact-message.input';

// Handles contact-form submissions: persists each inquiry to the database (so the
// team keeps a permanent record) and notifies the team via SMS (@ccatto/nest-sms).
@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly adminPhone: string;

  constructor(
    private readonly smsService: CattoSmsService,
    private readonly recaptchaService: CattoRecaptchaService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.adminPhone = this.configService.get<string>('ADMIN_PHONE') ?? '';
  }

  // Admin-only: list recent inquiries, newest first. Guarded at the resolver.
  async listContactMessages(limit = 100) {
    return this.prisma.client.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 500),
    });
  }

  async submitContactMessage(
    input: CreateContactMessageInput,
    recaptchaToken?: string,
  ): Promise<boolean> {
    // Spam guard: when a token is supplied, verify it. The service no-ops (allows)
    // when RECAPTCHA_SECRET_KEY is unset, so this is safe before keys are configured.
    if (recaptchaToken) {
      const isHuman = await this.recaptchaService.isHuman(recaptchaToken);
      if (!isHuman) {
        throw new BadRequestException(
          'reCAPTCHA verification failed. Please try again.',
        );
      }
    }

    // Persist first so the inquiry is never lost, even if the SMS fails.
    await this.prisma.client.contactMessage.create({
      data: {
        name: input.name,
        email: input.email,
        projectType: input.projectType,
        message: input.message,
      },
    });

    // Notify the team via SMS (best-effort — the record is already saved, so a
    // failed/unconfigured text must not fail the submission).
    if (!this.adminPhone) {
      this.logger.warn(
        'ADMIN_PHONE not configured — inquiry saved, but no SMS sent',
      );
      return true;
    }

    const trimmed =
      input.message.length > 250
        ? `${input.message.slice(0, 250)}…`
        : input.message;

    const message =
      `[Catto Software] New inquiry\n` +
      `Name: ${input.name}\n` +
      `Email: ${input.email}\n` +
      `Type: ${input.projectType}\n\n` +
      trimmed;

    try {
      const result = await this.smsService.sendSms({
        to: this.adminPhone,
        message,
      });
      if (result.success) {
        this.logger.log(`Contact SMS sent (id: ${result.messageId ?? 'n/a'})`);
      } else {
        this.logger.error(
          `Contact SMS not sent: ${result.error ?? 'unknown error'}`,
        );
      }
    } catch (err) {
      // Inquiry is already persisted; log and still report success to the user.
      this.logger.error(
        `Contact SMS threw: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    return true;
  }
}
