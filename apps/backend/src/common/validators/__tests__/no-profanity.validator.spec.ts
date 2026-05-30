/**
 * NoProfanity Validator Tests - Content moderation decorator
 *
 * Tests the custom class-validator decorator that uses @ccatto/profanity isProfane().
 */
import { isProfane } from '@ccatto/profanity';

// We test the underlying isProfane function directly since the decorator
// is a thin wrapper around registerDecorator that calls isProfane.

describe('NoProfanity validator (isProfane)', () => {
  it('returns false for clean text', () => {
    expect(isProfane('Hello World')).toBe(false);
    expect(isProfane('Tournament Champions 2025')).toBe(false);
    expect(isProfane('The Eagles')).toBe(false);
  });

  it('returns true for profane text', () => {
    // Using a commonly recognized profane word
    expect(isProfane('shit')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isProfane('')).toBe(false);
  });
});
