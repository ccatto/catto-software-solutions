// apps/backend/src/test/resolver-test-utils.ts
// Test utilities for GraphQL resolver testing

import { createMockUser } from './prisma-mock';

/**
 * Creates a mock auth response for testing auth resolvers
 */
export const createMockAuthResponse = (overrides = {}) => ({
  accessToken: 'mock-access-token-jwt',
  refreshToken: 'mock-refresh-token-jwt',
  user: {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
  },
  ...overrides,
});

/**
 * Creates a mock refresh token response
 */
export const createMockRefreshTokenResponse = (overrides = {}) => ({
  accessToken: 'new-access-token-jwt',
  ...overrides,
});

/**
 * Creates a mock forgot password response
 */
export const createMockForgotPasswordResponse = (overrides = {}) => ({
  message:
    'If an account exists with this email, a password reset link has been sent.',
  resetToken: 'mock-reset-token',
  ...overrides,
});

/**
 * Creates a mock reset password response
 */
export const createMockResetPasswordResponse = (overrides = {}) => ({
  message: 'Password has been reset successfully',
  ...overrides,
});

/**
 * Creates a mock GraphQL context with authenticated user
 * Use this for testing resolvers that use @Context decorator
 */
export const createMockGqlContext = (userOverrides = {}) => ({
  req: {
    user: createMockUser(userOverrides),
    headers: {
      authorization: 'Bearer mock-token',
    },
  },
});

/**
 * Creates a mock authenticated request object
 * Use for testing guards and context-dependent resolvers
 */
export const createMockAuthenticatedRequest = (
  userId: string,
  role = 'user',
) => ({
  headers: {
    authorization: 'Bearer mock-jwt-token',
  },
  user: {
    id: userId,
    sub: userId,
    email: 'test@example.com',
    role,
  },
});
