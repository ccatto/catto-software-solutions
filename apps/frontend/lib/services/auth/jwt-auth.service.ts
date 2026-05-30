// apps/frontend/lib/services/auth/jwt-auth.service.ts
// Platform-agnostic JWT authentication service. Used by mobile builds and any
// flow that prefers a self-managed token over Better Auth cookies.
//
// Baseline ships email+password login/register/logout/refresh. Apps that want
// passkey (WebAuthn) or phone OTP should extend this service per their needs.
import { log } from '@app/lib/logger';
import type { IAuthStorage } from './storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ?? 'http://localhost:4000/graphql';

async function gqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(json.errors[0].message ?? 'GraphQL error');
  }
  return json.data as T;
}

export class JwtAuthService {
  constructor(private storage: IAuthStorage) {}

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const { login } = await gqlRequest<{ login: LoginResponse }>(
        `mutation Login($input: LoginInput!) {
          login(input: $input) {
            accessToken refreshToken
            user { id email name role }
          }
        }`,
        { input: credentials },
      );
      await this.storage.setAccessToken(login.accessToken);
      await this.storage.setRefreshToken(login.refreshToken);
      log.info('User logged in successfully', { userId: login.user.id });
      return login;
    } catch (error) {
      log.error('Login failed', { error });
      throw error;
    }
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    try {
      const { register } = await gqlRequest<{ register: LoginResponse }>(
        `mutation Register($input: RegisterInput!) {
          register(input: $input) {
            accessToken refreshToken
            user { id email name role }
          }
        }`,
        { input: data },
      );
      await this.storage.setAccessToken(register.accessToken);
      await this.storage.setRefreshToken(register.refreshToken);
      log.info('User registered successfully', { userId: register.user.id });
      return register;
    } catch (error) {
      log.error('Registration failed', { error });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = await this.storage.getRefreshToken();
      if (refreshToken) {
        await gqlRequest(
          `mutation Logout($refreshToken: String!) { logout(refreshToken: $refreshToken) }`,
          { refreshToken },
        ).catch(() => {
          // Ignore — still clear local tokens
        });
      }
    } finally {
      await this.storage.clearTokens();
      log.info('User logged out');
    }
  }

  async refreshAccessToken(): Promise<string> {
    const refreshToken = await this.storage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    try {
      const { refreshAccessToken } = await gqlRequest<{
        refreshAccessToken: { accessToken: string };
      }>(
        `mutation Refresh($refreshToken: String!) {
          refreshAccessToken(refreshToken: $refreshToken) { accessToken }
        }`,
        { refreshToken },
      );
      await this.storage.setAccessToken(refreshAccessToken.accessToken);
      return refreshAccessToken.accessToken;
    } catch (error) {
      await this.storage.clearTokens();
      log.error('Token refresh failed', { error });
      throw new Error('Session expired');
    }
  }

  async getAccessToken(): Promise<string | null> {
    return this.storage.getAccessToken();
  }

  private isTokenExpiredOrExpiring(token: string, bufferSeconds = 120): boolean {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      const exp = payload.exp;
      if (!exp) return true;
      const nowSeconds = Math.floor(Date.now() / 1000);
      return nowSeconds >= exp - bufferSeconds;
    } catch {
      return true;
    }
  }

  private refreshPromise: Promise<string> | null = null;

  async getAuthHeaders(): Promise<Record<string, string>> {
    let token = await this.getAccessToken();
    if (!token) return {};
    if (this.isTokenExpiredOrExpiring(token)) {
      try {
        if (!this.refreshPromise) {
          this.refreshPromise = this.refreshAccessToken().finally(() => {
            this.refreshPromise = null;
          });
        }
        token = await this.refreshPromise;
      } catch {
        return {};
      }
    }
    return { Authorization: `Bearer ${token}` };
  }

  async isAuthenticated(): Promise<boolean> {
    return this.storage.hasTokens();
  }

  async hasTokens(): Promise<boolean> {
    return this.storage.hasTokens();
  }

  decodeToken(token: string): AuthUser | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const payload = JSON.parse(jsonPayload);
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name ?? null,
        role: payload.role ?? 'user',
      };
    } catch {
      return null;
    }
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const token = await this.getAccessToken();
    if (!token) return null;
    return this.decodeToken(token);
  }
}
