/**
 * Better Auth API Route Handler
 *
 * Handles all Better Auth endpoints (sign-in, sign-out, session, callbacks, etc.)
 *
 * URL: /api/auth/[...all]
 *
 * @see https://www.better-auth.com/docs/integrations/next
 */

import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/app/lib/logger';
import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@lib/auth-better';

const { GET: baseGet, POST: basePost } = toNextJsHandler(auth);

// Wrap handlers with error logging
export async function GET(request: NextRequest) {
  try {
    return await baseGet(request);
  } catch (error) {
    log.error('[BETTER-AUTH] GET error', {
      url: request.url,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    return await basePost(request);
  } catch (error) {
    log.error('[BETTER-AUTH] POST error', {
      url: request.url,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}
