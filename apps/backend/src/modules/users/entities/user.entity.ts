// apps/backend/src/modules/users/entities/user.entity.ts
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  username?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  image?: string;

  @Field()
  role: string;

  @Field()
  emailVerified: boolean;

  // Password is not exposed via GraphQL
  password?: string;
}
