/**
 * Auth Guards Tests - Platform admin, roles, and dual-auth guards
 *
 * Tests PlatformAdminGuard (JWT + DB lookup), GqlRolesGuard (role checking via Reflector),
 * and GqlAuthGuard (dual-auth: JWT + x-user-id header fallback).
 *
 * Guards require mocked ExecutionContext and GqlExecutionContext.
 */
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PlatformAdminGuard } from '../platform-admin.guard';
import { GqlRolesGuard } from '../gql-roles.guard';
import { RolesGuard } from '../roles.guard';
import { GqlAuthGuard } from '../gql-auth.guard';

// ============================================================
// Mock Helpers
// ============================================================

/**
 * Create a mock ExecutionContext that GqlExecutionContext.create() can use.
 * NestJS guards call GqlExecutionContext.create(context).getContext().req
 */
function createMockExecutionContext(
  user: any,
  headers: Record<string, string> = {},
) {
  const req = { user, headers };
  const mockContext = {
    getContext: () => ({ req }),
    getInfo: () => ({}),
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
  };

  // The context needs to work with GqlExecutionContext.create()
  // which reads from context.getType(), context.getArgs(), etc.
  return {
    getType: () => 'graphql',
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
    getArgs: () => [{}, {}, { req }, {}],
    switchToHttp: () => ({ getRequest: () => req }),
    // For GqlExecutionContext.create() compatibility
    getArgByIndex: (index: number) => [req, {}, { req }, {}][index],
  } as any;
}

// ============================================================
// PlatformAdminGuard
// ============================================================

describe('PlatformAdminGuard', () => {
  let guard: PlatformAdminGuard;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      client: {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      },
    };
    guard = new PlatformAdminGuard(mockPrisma, { jwt: { secret: 'test' } });
  });

  it('allows platform_admin role from JWT', async () => {
    const context = createMockExecutionContext({
      userId: 'user-1',
      role: 'platform_admin',
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    // Should NOT need DB lookup since role is already on JWT user
    expect(mockPrisma.client.user.findUnique).not.toHaveBeenCalled();
  });

  it('falls back to DB lookup for x-user-id auth users', async () => {
    const context = createMockExecutionContext({
      id: 'user-1',
      userId: 'user-1',
      role: 'user', // JWT doesn't have platform_admin
    });

    mockPrisma.client.user.findUnique.mockResolvedValue({
      role: 'platform_admin',
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockPrisma.client.user.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
      }),
    );
  });

  it('throws ForbiddenException when no user', async () => {
    const context = createMockExecutionContext(null);

    await expect(guard.canActivate(context)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('throws ForbiddenException when user is not platform_admin', async () => {
    const context = createMockExecutionContext({
      userId: 'user-1',
      role: 'user',
    });

    mockPrisma.client.user.findUnique.mockResolvedValue({ role: 'user' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      'Platform admin access required',
    );
  });
});

// ============================================================
// GqlRolesGuard
// ============================================================

describe('GqlRolesGuard', () => {
  let guard: GqlRolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new GqlRolesGuard(reflector);
  });

  it('returns true when no roles required (no decorator)', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = createMockExecutionContext({ role: 'user' });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('returns true when user role is in requiredRoles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['admin', 'platform_admin']);

    const context = createMockExecutionContext({ role: 'platform_admin' });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('returns false when user role is not in requiredRoles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['admin', 'platform_admin']);

    const context = createMockExecutionContext({ role: 'user' });
    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('works with single required role', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['platform_admin']);

    const context = createMockExecutionContext({ role: 'platform_admin' });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('returns false when user.role is undefined', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const context = createMockExecutionContext({ id: 'user-1' }); // no role field
    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('returns false when user is null', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const context = createMockExecutionContext(null);
    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });
});

// ============================================================
// RolesGuard (non-GQL, REST)
// ============================================================

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('returns true when no roles required', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

    const context = createMockExecutionContext({ role: 'user' });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('returns false when user is null', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const context = createMockExecutionContext(null);
    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('returns false when user.role is undefined', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);

    const context = createMockExecutionContext({ id: 'user-1' });
    const result = guard.canActivate(context);

    expect(result).toBe(false);
  });

  it('returns true when user role matches required roles', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue(['admin', 'platform_admin']);

    const context = createMockExecutionContext({ role: 'platform_admin' });
    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });
});

// ============================================================
// GqlAuthGuard (dual-auth: JWT + x-user-id with DB lookup)
// ============================================================

// Mock @nestjs/passport — Jest hoists this to the top, so it must include
// all exports used by the import chain (AuthGuard + PassportStrategy + PassportModule)
jest.mock('@nestjs/passport', () => ({
  AuthGuard: () => {
    class MockAuthGuard {
      canActivate() {
        throw new UnauthorizedException('No JWT');
      }
    }
    return MockAuthGuard;
  },
  PassportStrategy: () => class MockStrategy {},
  PassportModule: { register: () => ({ module: class {} }) },
}));

describe('GqlAuthGuard', () => {
  let guard: GqlAuthGuard;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      client: {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      },
    };
    guard = new GqlAuthGuard(mockPrisma, { jwt: { secret: 'test' } });
  });

  it('validates x-user-id against database and attaches real role', async () => {
    const context = createMockExecutionContext(null, {
      'x-user-id': 'oauth-user-1',
    });

    mockPrisma.client.user.findUnique.mockResolvedValue({
      id: 'oauth-user-1',
      role: 'platform_admin',
    });

    const result = await guard.canActivate(context);

    expect(result).toBe(true);
    expect(mockPrisma.client.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'oauth-user-1' },
      select: { id: true, role: true },
    });
    // Verify the actual DB role is attached, not hardcoded 'user'
    const req = context.switchToHttp().getRequest();
    expect(req.user.role).toBe('platform_admin');
  });

  it('throws UnauthorizedException when x-user-id not found in DB', async () => {
    const context = createMockExecutionContext(null, {
      'x-user-id': 'nonexistent-user',
    });

    mockPrisma.client.user.findUnique.mockResolvedValue(null);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    await expect(guard.canActivate(context)).rejects.toThrow('User not found');
  });

  it('throws UnauthorizedException when no auth provided', async () => {
    const context = createMockExecutionContext(null);

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('rejects empty x-user-id header', async () => {
    const context = createMockExecutionContext(null, { 'x-user-id': '' });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockPrisma.client.user.findUnique).not.toHaveBeenCalled();
  });
});
