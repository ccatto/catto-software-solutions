import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CattoSmsService } from '@ccatto/nest-sms';
import { CattoRecaptchaService } from '@ccatto/nest-recaptcha';
import { CreateContactMessageInput } from './dto/create-contact-message.input';

// Sends contact-form submissions to the team as an SMS via @ccatto/nest-sms (Telnyx).
// Mirrors the rleaguez contact module. SMS-only for now (no persistence/email/recaptcha).
@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private readonly adminPhone: string;

  constructor(
    private readonly smsService: CattoSmsService,
    private readonly recaptchaService: CattoRecaptchaService,
    private readonly configService: ConfigService,
  ) {
    this.adminPhone = this.configService.get<string>('ADMIN_PHONE') ?? '';
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

    if (!this.adminPhone) {
      this.logger.error(
        'ADMIN_PHONE is not configured — cannot send contact SMS',
      );
      return false;
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

    // sendSms throws (BadRequestException) on misconfig / Telnyx error — let it
    // propagate so the GraphQL layer surfaces an error to the form.
    const result = await this.smsService.sendSms({
      to: this.adminPhone,
      message,
    });

    if (!result.success) {
      this.logger.error(
        `Contact SMS not sent: ${result.error ?? 'unknown error'}`,
      );
      return false;
    }

    this.logger.log(`Contact SMS sent (id: ${result.messageId ?? 'n/a'})`);
    return true;
  }
}
