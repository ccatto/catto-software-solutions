/**
 * GraphqlThrottlerGuard Tests - Rate limiting exemptions
 *
 * Tests shouldSkip logic for exempt operations, exempt fields,
 * and request/response method polyfilling.
 *
 * The guard extends @nestjs/throttler's ThrottlerGuard and adds
 * GraphQL operation-based exemptions.
 */
import { GraphqlThrottlerGuard } from '../graphql-throttler.guard';

// ============================================================
// Mock Helpers
// ============================================================

function createMockContext(
  operationName: string | null,
  fieldName: string | null = null,
  bodyOperationName: string | null = null,
) {
  return {
    getType: () => 'graphql',
    getHandler: () => jest.fn(),
    getClass: () => jest.fn(),
    getArgs: () => [
      {},
      {},
      {
        req: {
          headers: {},
          body: bodyOperationName ? { operationName: bodyOperationName } : {},
        },
      },
      {},
    ],
    getArgByIndex: (index: number) => {
      if (index === 2) {
        return {
          req: {
            headers: {},
            body: bodyOperationName ? { operationName: bodyOperationName } : {},
          },
        };
      }
      return {};
    },
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {},
        body: bodyOperationName ? { operationName: bodyOperationName } : {},
      }),
      getResponse: () => ({}),
    }),
  } as any;
}

// ============================================================
// Test Suite
// ============================================================

describe('GraphqlThrottlerGuard', () => {
  let guard: GraphqlThrottlerGuard;

  beforeEach(() => {
    // Create guard instance - we test the protected shouldSkip method directly
    // by accessing it through the prototype
    guard = Object.create(GraphqlThrottlerGuard.prototype);
  });

  describe('shouldSkip', () => {
    it('skips exempt operations (e.g., GetMatchScores)', async () => {
      const context = createMockContext('GetMatchScores');

      // Access the protected method - need to mock GqlExecutionContext
      // We test via the class's shouldSkip behavior by mocking what it reads
      const mockGqlCtx = {
        getInfo: () => ({
          operation: { name: { value: 'GetMatchScores' } },
          fieldName: null,
        }),
        getContext: () => ({
          req: { body: {} },
        }),
      };

      // Use jest to spy on the static create method
      jest
        .spyOn(require('@nestjs/graphql').GqlExecutionContext, 'create')
        .mockReturnValue(mockGqlCtx);

      const result = await (guard as any).shouldSkip(context);

      expect(result).toBe(true);
    });

    it('skips exempt field names (e.g., teamsByTournament)', async () => {
      const context = createMockContext(null, 'teamsByTournament');

      const mockGqlCtx = {
        getInfo: () => ({
          operation: { name: null },
          fieldName: 'teamsByTournament',
        }),
        getContext: () => ({
          req: { body: {} },
        }),
      };

      jest
        .spyOn(require('@nestjs/graphql').GqlExecutionContext, 'create')
        .mockReturnValue(mockGqlCtx);

      const result = await (guard as any).shouldSkip(context);

      expect(result).toBe(true);
    });

    it('does NOT skip non-exempt operations', async () => {
      const context = createMockContext('CreateTournament');

      const mockGqlCtx = {
        getInfo: () => ({
          operation: { name: { value: 'CreateTournament' } },
          fieldName: 'createTournament',
        }),
        getContext: () => ({
          req: { body: { operationName: 'CreateTournament' } },
        }),
      };

      jest
        .spyOn(require('@nestjs/graphql').GqlExecutionContext, 'create')
        .mockReturnValue(mockGqlCtx);

      const result = await (guard as any).shouldSkip(context);

      expect(result).toBe(false);
    });

    it('checks req.body.operationName as backup', async () => {
      const context = createMockContext(null, null, 'GetTournamentTeams');

      const mockGqlCtx = {
        getInfo: () => ({
          operation: { name: null },
          fieldName: null,
        }),
        getContext: () => ({
          req: { body: { operationName: 'GetTournamentTeams' } },
        }),
      };

      jest
        .spyOn(require('@nestjs/graphql').GqlExecutionContext, 'create')
        .mockReturnValue(mockGqlCtx);

      const result = await (guard as any).shouldSkip(context);

      expect(result).toBe(true);
    });

    it('returns false when no operation info available', async () => {
      const context = createMockContext(null);

      const mockGqlCtx = {
        getInfo: () => ({
          operation: null,
          fieldName: null,
        }),
        getContext: () => ({
          req: { body: {} },
        }),
      };

      jest
        .spyOn(require('@nestjs/graphql').GqlExecutionContext, 'create')
        .mockReturnValue(mockGqlCtx);

      const result = await (guard as any).shouldSkip(context);

      expect(result).toBe(false);
    });
  });
});
