// apps/backend/src/env.ts
// Preload environment variables before any NestJS modules are imported.
// This file must be imported FIRST in main.ts so that process.env is populated
// before module decorators (like CattoAuthModule.forRoot()) read env vars.
import { config } from 'dotenv';

config({ path: ['.env.local', '.env'] });
