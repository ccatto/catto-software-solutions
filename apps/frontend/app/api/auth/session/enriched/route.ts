/**
 * Enriched Session API Endpoint
 *
 * Returns the session with additional fields (playerID, role, organizations)
 * that match the NextAuth CustomSession structure.
 *
 * This endpoint is used by the useBetterSession hook on the client side.
 */

import { NextResponse } from 'next/server';
import { getEnrichedSession } from '@lib/auth-better';

export async function GET(request: Request) {
  try {
    const session = await getEnrichedSession(request.headers as Headers);

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('[API] Error getting enriched session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
