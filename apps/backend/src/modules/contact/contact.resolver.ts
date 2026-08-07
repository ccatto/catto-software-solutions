import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { GqlAuthGuard } from '../../auth/guards/gql-auth.guard';
import { GqlRolesGuard } from '../../auth/guards/gql-roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { ContactService } from './contact.service';
import { CreateContactMessageInput } from './dto/create-contact-message.input';
import { ContactResponse } from './dto/contact-response.type';
import { ContactMessage } from './dto/contact-message.type';

// Public mutation (no auth guard). Rate-limited to 3 submissions/hour per client
// on top of the global throttler — mirrors the rleaguez contact resolver.
@Resolver()
export class ContactResolver {
  constructor(private readonly contactService: ContactService) {}

  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 per hour
  @Mutation(() => ContactResponse, {
    description:
      'Submit a contact-form inquiry; notifies the team via SMS (public — no auth).',
  })
  async submitContactMessage(
    @Args('input') input: CreateContactMessageInput,
    @Args('recaptchaToken', { nullable: true }) recaptchaToken?: string,
  ): Promise<ContactResponse> {
    const sent = await this.contactService.submitContactMessage(
      input,
      recaptchaToken,
    );
    return sent
      ? { success: true, message: 'Thanks — your message was sent.' }
      : {
          success: false,
          message: 'Could not send your message. Please email us instead.',
        };
  }

  // Admin-only: list persisted contact inquiries for the dashboard.
  @UseGuards(GqlAuthGuard, GqlRolesGuard)
  @Roles('platform_admin')
  @Query(() => [ContactMessage], {
    description:
      'List persisted contact-form inquiries, newest first (platform_admin only).',
  })
  async contactMessages(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 100 })
    limit: number,
  ): Promise<ContactMessage[]> {
    return this.contactService.listContactMessages(limit);
  }
}
