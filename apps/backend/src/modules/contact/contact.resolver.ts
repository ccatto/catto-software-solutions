import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactMessageInput } from './dto/create-contact-message.input';
import { ContactResponse } from './dto/contact-response.type';

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
  ): Promise<ContactResponse> {
    const sent = await this.contactService.submitContactMessage(input);
    return sent
      ? { success: true, message: 'Thanks — your message was sent.' }
      : {
          success: false,
          message: 'Could not send your message. Please email us instead.',
        };
  }
}
