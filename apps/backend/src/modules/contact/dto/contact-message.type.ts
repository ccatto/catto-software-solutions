import { Field, ID, ObjectType } from '@nestjs/graphql';

// A persisted contact-form submission, surfaced to admins in the dashboard.
@ObjectType()
export class ContactMessage {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  projectType: string;

  @Field()
  message: string;

  @Field()
  createdAt: Date;
}
