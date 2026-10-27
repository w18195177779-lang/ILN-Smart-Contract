import { describe, expect, it } from 'vitest';
import { enforcePriceFreshness, StalePriceError } from '../verify-stale-price-rejection';

describe('Enforce Stale Price Rejection (#1042)', () => {
  it('accepts fresh price within allowable threshold', () => {
    expect(enforcePriceFreshness(1000, 995, 10)).toBe(true);
  });

  it('rejects stale price strictly at boundary (age == maxAge)', () => {
    expect(() => enforcePriceFreshness(1000, 990, 10)).toThrow(StalePriceError);
  });

  it('rejects stale price exceeding threshold (age > maxAge)', () => {
    expect(() => enforcePriceFreshness(1000, 950, 10)).toThrow(StalePriceError);
  });

  it('rejects future-dated price timestamp', () => {
    expect(() => enforcePriceFreshness(1000, 1005, 10)).toThrow(StalePriceError);
  });
});
