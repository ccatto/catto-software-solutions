// apps/backend/src/common/guards/graphql-throttler.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Ensure request object has the header() method required by @nestjs/throttler v6.x
 * Some GraphQL contexts may have a request object without this Express method
 */
function ensureRequestMethods(
  req: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!req) {
    return {
      ip: 'unknown',
      headers: {},
      header: () => undefined,
      connection: { remoteAddress: 'unknown' },
    };
  }

  // If request already has header method, return as-is
  if (typeof req.header === 'function') {
    return req;
  }

  // Add header method that reads from headers object (Express-compatible)
  const headers =
    (req.headers as Record<string, string | string[] | undefined>) || {};
  return {
    ...req,
    header: (name: string) => {
      const value = headers[name.toLowerCase()];
      return Array.isArray(value) ? value[0] : value;
    },
  };
}

/**
 * Ensure response object has the header() method required by @nestjs/throttler v6.x
 * The throttler needs res.header() to set rate limit headers on responses
 */
function ensureResponseMethods(
  res: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!res) {
    // Return a mock response that silently accepts header calls
    const mockHeaders: Record<string, string> = {};
    return {
      header: (name: string, value: string) => {
        mockHeaders[name] = value;
        return res; // chainable
      },
      setHeader: (name: string, value: string) => {
        mockHeaders[name] = value;
        return res;
      },
      getHeader: (name: string) => mockHeaders[name],
    };
  }

  // If response already has header method, return as-is
  if (typeof res.header === 'function') {
    return res;
  }

  // If response has setHeader (Node.js http.ServerResponse) but not header (Express)
  if (typeof res.setHeader === 'function') {
    return {
      ...res,
      header: (name: string, value: string) => {
        (res.setHeader as (n: string, v: string) => void)(name, value);
        return res;
      },
    };
  }

  // Last resort: add a no-op header method
  return {
    ...res,
    header: () => res,
    setHeader: () => res,
  };
}

/**
 * GraphQL operations that are exempt from rate limiting.
 * Add read-heavy operations that may fire multiple times
 * simultaneously when loading data-intensive pages.
 */
const EXEMPT_OPERATIONS = new Set<string>([
  // Add exempt operation names here, e.g.:
  // 'GetDashboardData',
]);

/**
 * GraphQL field names that are exempt from rate limiting.
 * Used as a fallback when operation name isn't available.
 */
const EXEMPT_FIELDS = new Set<string>([
  // Add exempt field names here, e.g.:
  // 'dashboardData',
]);

@Injectable()
export class GraphqlThrottlerGuard extends ThrottlerGuard {
  /**
   * Skip rate limiting for certain read-heavy GraphQL queries.
   * This prevents rate limit errors when loading data-intensive pages
   * like brackets where many queries fire simultaneously.
   */
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    // Check if this is a GraphQL context
    const gqlCtx = GqlExecutionContext.create(context);
    const info = gqlCtx.getInfo();

    // If we have GraphQL info, check the operation name
    if (info?.operation?.name?.value) {
      const operationName = info.operation.name.value;
      if (EXEMPT_OPERATIONS.has(operationName)) {
        return true;
      }
    }

    // Also check request body for operation name (backup method)
    const ctx = gqlCtx.getContext();
    const reqOperationName = ctx?.req?.body?.operationName;
    if (reqOperationName && EXEMPT_OPERATIONS.has(reqOperationName)) {
      return true;
    }

    // Check for field name as fallback (for when operation name isn't set)
    const fieldName = info?.fieldName;
    if (fieldName && EXEMPT_FIELDS.has(fieldName)) {
      return true;
    }

    return false;
  }

  /**
   * Extract request from either REST or GraphQL context
   * Compatible with @nestjs/throttler v6.x which expects req.header() and res.header() methods
   */
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();

    // If this is a GraphQL request with req/res in context
    if (ctx && ctx.req) {
      return {
        req: ensureRequestMethods(ctx.req),
        res: ensureResponseMethods(ctx.res),
      };
    }

    // Fall back to HTTP context for REST endpoints
    const http = context.switchToHttp();
    const req = http.getRequest();
    const res = http.getResponse();

    return {
      req: ensureRequestMethods(req),
      res: ensureResponseMethods(res),
    };
  }

  /**
   * Generate a unique tracker key based on IP and operation
   */
  protected async getTracker(req: Record<string, any>): Promise<string> {
    // Use IP address for tracking (handles proxies via x-forwarded-for)
    const ip =
      req.headers?.['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.ip ||
      req.connection?.remoteAddress ||
      'unknown';
    return ip;
  }
}
