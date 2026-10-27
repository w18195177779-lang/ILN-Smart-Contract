import { describe, expect, it } from 'vitest';
import {
  validateAndPersistPrice,
  PriceTimestampError,
} from '../verify-persist-price-timestamp';

describe('Persist and Validate Price Timestamps (#1044)', () => {
  it('accepts fresh, non-regressing price timestamps', () => {
    const record = validateAndPersistPrice(100, 1050, 1060, 20, 1040);
    expect(record.price).toBe(100);
    expect(record.timestampLedger).toBe(1050);
  });

  it('rejects future-dated price timestamps', () => {
    expect(() => validateAndPersistPrice(100, 1070, 1060, 20, 1040)).toThrow(
      PriceTimestampError
    );
  });

  it('rejects stale price timestamps beyond maxAgeLedgers', () => {
    expect(() => validateAndPersistPrice(100, 1030, 1060, 20, 1020)).toThrow(
      PriceTimestampError
    );
  });

  it('rejects timestamp regression relative to previous recorded price', () => {
    expect(() => validateAndPersistPrice(100, 1040, 1060, 50, 1050)).toThrow(
      PriceTimestampError
    );
  });
});
