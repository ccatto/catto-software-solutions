// apps/frontend/lib/validation/profanity.ts
// Re-export profanity helpers from @ccatto/profanity
// Downstream consumers import from this file — no changes needed in form schemas.
export {
  isProfane,
  noProfanityCheck,
  noProfanityMessage,
} from '@ccatto/profanity';
