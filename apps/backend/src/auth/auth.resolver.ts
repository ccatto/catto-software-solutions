// apps/backend/src/auth/auth.resolver.ts
import {
  Resolver,
  Mutation,
  Query,
  Args,
  ObjectType,
  Field,
  InputType,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { WebAuthnService } from './webauthn.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { TokenUser } from './interfaces/auth.interfaces';
import {
  PasskeyRegistrationOptionsResponse,
  VerifyPasskeyRegistrationInput,
  PasskeyRegistrationResult,
  PasskeyAuthenticationOptionsResponse,
  VerifyPasskeyAuthenticationInput,
  PasskeyInfo,
  PasskeyOperationResult,
} from './dto/webauthn.dto';

// GraphQL Input Types
@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  name: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

// GraphQL Response Types
@ObjectType()
export class AuthUser {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string;

  @Field()
  role: string;
}

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => AuthUser)
  user: AuthUser;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message: string;
}

@ObjectType()
export class ForgotPasswordResponse {
  @Field()
  message: string;

  @Field({ nullable: true })
  resetToken?: string; // In production, this would be sent via email instead
}

@ObjectType()
export class ResetPasswordResponse {
  @Field()
  message: string;
}

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private webAuthnService: WebAuthnService,
  ) {}

  /**
   * Register a new user
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @Mutation(() => AuthResponse)
  async registerUser(
    @Args('input') input: RegisterInput,
  ): Promise<AuthResponse> {
    return this.authService.register({
      email: input.email,
      password: input.password,
      name: input.name,
    });
  }

  /**
   * Login user
   */
  @Throttle({ default: { limit: 8, ttl: 60000 } }) // 8 login attempts per minute
  @Mutation(() => AuthResponse)
  async loginUser(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login({
      email: input.email,
      password: input.password,
    });
  }

  /**
   * Refresh access token
   */
  @Mutation(() => RefreshTokenResponse)
  async refreshToken(
    @Args('refreshToken') refreshToken: string,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(refreshToken);
  }

  /**
   * Logout (invalidate refresh token)
   */
  @Mutation(() => LogoutResponse)
  async logoutUser(
    @Args('refreshToken') refreshToken: string,
  ): Promise<LogoutResponse> {
    await this.authService.logout(refreshToken);
    return { message: 'Logged out successfully' };
  }

  /**
   * Request password reset
   * Generates a reset token (in production, this would be sent via email)
   */
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 requests per minute
  @Mutation(() => ForgotPasswordResponse)
  async forgotPassword(
    @Args('email') email: string,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(email);
  }

  /**
   * Reset password using reset token
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetToken') resetToken: string,
    @Args('newPassword') newPassword: string,
  ): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(resetToken, newPassword);
  }

  // --- Passkey (WebAuthn) ---

  @UseGuards(GqlAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Mutation(() => PasskeyRegistrationOptionsResponse)
  async generatePasskeyRegistrationOptions(
    @CurrentUser() user: TokenUser,
  ): Promise<PasskeyRegistrationOptionsResponse> {
    // For OAuth users (x-user-id header), email may be missing from TokenUser.
    // Look up the user's email from DB if needed.
    let email = user.email;
    if (!email) {
      const dbUser = await this.authService.findUserById(user.userId);
      email = dbUser?.email || user.userId;
    }
    const options = await this.webAuthnService.generateRegistrationOpts(
      user.userId,
      email,
      null,
    );
    return { options: JSON.stringify(options) };
  }

  @UseGuards(GqlAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Mutation(() => PasskeyRegistrationResult)
  async verifyPasskeyRegistration(
    @CurrentUser() user: TokenUser,
    @Args('input') input: VerifyPasskeyRegistrationInput,
  ): Promise<PasskeyRegistrationResult> {
    const responseJSON = JSON.parse(input.response);
    const result = await this.webAuthnService.verifyRegistration(
      user.userId,
      responseJSON,
      input.friendlyName,
    );
    return {
      success: true,
      id: result.id,
      friendlyName: result.friendlyName,
    };
  }

  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Mutation(() => PasskeyAuthenticationOptionsResponse)
  async generatePasskeyAuthenticationOptions(
    @Args('email', { nullable: true }) email?: string,
  ): Promise<PasskeyAuthenticationOptionsResponse> {
    const { options, sessionId } =
      await this.webAuthnService.generateAuthenticationOpts(email);
    return { options: JSON.stringify(options), sessionId };
  }

  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Mutation(() => AuthResponse)
  async verifyPasskeyAuthentication(
    @Args('input') input: VerifyPasskeyAuthenticationInput,
  ): Promise<AuthResponse> {
    const responseJSON = JSON.parse(input.response);
    const userId = await this.webAuthnService.verifyAuthentication(
      input.sessionId,
      responseJSON,
    );
    return this.authService.loginByPasskey(userId);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [PasskeyInfo])
  async myPasskeys(@CurrentUser() user: TokenUser): Promise<PasskeyInfo[]> {
    return this.webAuthnService.getPasskeysByUser(user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PasskeyOperationResult)
  async deletePasskey(
    @CurrentUser() user: TokenUser,
    @Args('passkeyId') passkeyId: string,
  ): Promise<PasskeyOperationResult> {
    await this.webAuthnService.deletePasskey(passkeyId, user.userId);
    return { success: true };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => PasskeyOperationResult)
  async renamePasskey(
    @CurrentUser() user: TokenUser,
    @Args('passkeyId') passkeyId: string,
    @Args('friendlyName') friendlyName: string,
  ): Promise<PasskeyOperationResult> {
    await this.webAuthnService.renamePasskey(
      passkeyId,
      user.userId,
      friendlyName,
    );
    return { success: true };
  }
}
