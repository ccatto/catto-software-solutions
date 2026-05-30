import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
  Observable,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { log } from '@app/lib/logger';
import { authService } from './services/auth/auth-provider';
import { sessionStore } from './stores/session-store';

// TODO: Update these URLs for your deployment
const graphqlUri =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';

const httpLink = createHttpLink({
  uri: graphqlUri,
  credentials: 'include',
});

function getStoredSession() {
  return sessionStore.getSession();
}

/**
 * Auth link - adds JWT token or session user ID to requests
 * Supports DUAL AUTH: JWT (mobile/email) AND Better Auth (OAuth)
 */
const authLink = setContext(async (_, { headers }) => {
  try {
    // First, try JWT auth (mobile/email login)
    const jwtAuthHeaders = await authService.getAuthHeaders();
    if (jwtAuthHeaders.Authorization) {
      return {
        headers: { ...headers, ...jwtAuthHeaders },
      };
    }

    // Fall back to Better Auth session (OAuth)
    const session = getStoredSession();
    if (session?.user?.id) {
      return {
        headers: { ...headers, 'x-user-id': session.user.id },
      };
    }

    return { headers };
  } catch (error) {
    log.debug('Failed to get auth headers', { error });
    return { headers };
  }
});

/**
 * Error link - handles auth errors with automatic token refresh
 */
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      const hasAuthError = graphQLErrors.some(
        (err) =>
          err.extensions?.code === 'UNAUTHENTICATED' ||
          err.message.includes('Unauthorized'),
      );

      if (hasAuthError) {
        return new Observable((subscriber) => {
          authService
            .refreshAccessToken()
            .then(async (newToken) => {
              const oldHeaders = operation.getContext().headers || {};
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  Authorization: `Bearer ${newToken}`,
                },
              });
              forward(operation).subscribe({
                next: subscriber.next.bind(subscriber),
                error: subscriber.error.bind(subscriber),
                complete: subscriber.complete.bind(subscriber),
              });
            })
            .catch((refreshError) => {
              log.debug('Token refresh failed', { error: refreshError });
              subscriber.error(graphQLErrors[0]);
            });
        });
      }

      for (const err of graphQLErrors) {
        if (err.extensions?.code !== 'UNAUTHENTICATED') {
          log.warn('GraphQL error', {
            operation: operation.operationName,
            message: err.message,
          });
        }
      }
    }

    if (networkError) {
      log.error('Network error in GraphQL request', { error: networkError });
    }
  },
);

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
