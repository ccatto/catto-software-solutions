// apps/backend/src/test/prisma-mock.ts
// Prisma mock utilities for testing

/**
 * Creates a mock Prisma client for unit testing
 * All methods return jest.fn() by default
 */
export const createMockPrismaClient = () => {
  const mockMethods = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  return new Proxy({} as Record<string, unknown>, {
    get: (_target, prop) => {
      if (prop === '$connect' || prop === '$disconnect') {
        return jest.fn();
      }
      if (prop === '$transaction') {
        return jest.fn((callback: (client: unknown) => unknown) =>
          callback(_target),
        );
      }
      return { ...mockMethods };
    },
  });
};

/**
 * Helper to create mock user data
 */
export const createMockUser = (overrides = {}) => ({
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedpassword123',
  role: 'user',
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
  ...overrides,
});
