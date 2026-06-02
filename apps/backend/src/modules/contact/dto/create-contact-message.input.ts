import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NoProfanity } from '../../../common/validators/no-profanity.validator';

// Mirrors the marketing contact form fields (apps/frontend .../ContactSection.tsx).
// TODO: add reCAPTCHA (@ccatto/nest-recaptcha) once the spam-guard pass lands.
@InputType()
export class CreateContactMessageInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  @NoProfanity()
  name: string;

  @Field()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  projectType: string;

  @Field()
  @IsString()
  @MinLength(20)
  @MaxLength(5000)
  @NoProfanity()
  message: string;
}
