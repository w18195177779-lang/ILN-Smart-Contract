/**
 * Price Timestamp Persistence & Validation Engine (#1044)
 *
 * Implements timestamp validation rules:
 * - Rejects future-dated timestamps (timestamp > currentLedger)
 * - Rejects stale timestamps (currentLedger - timestamp >= maxAgeLedgers)
 * - Rejects timestamp regression (timestamp < lastSeenTimestamp)
 * - Persists validated price with timestamp metadata
 */

export class PriceTimestampError extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(`[${code}] ${message}`);
    this.name = 'PriceTimestampError';
    this.code = code;
  }
}

export interface PersistedPrice {
  price: number;
  timestampLedger: number;
  recordedAtSeconds: number;
}

export function validateAndPersistPrice(
  price: number,
  reportedLedger: number,
  currentLedger: number,
  maxAgeLedgers: number,
  lastRecordedLedger: number | null,
): PersistedPrice {
  if (reportedLedger > currentLedger) {
    throw new PriceTimestampError(
      `Future-dated price timestamp rejected: reported ${reportedLedger} > current ${currentLedger}`,
      'ORACLE_DATA_FUTURE'
    );
  }

  if (currentLedger - reportedLedger >= maxAgeLedgers) {
    throw new PriceTimestampError(
      `Stale price timestamp rejected: age ${currentLedger - reportedLedger} >= max ${maxAgeLedgers}`,
      'ORACLE_DATA_STALE'
    );
  }

  if (lastRecordedLedger !== null && reportedLedger < lastRecordedLedger) {
    throw new PriceTimestampError(
      `Price timestamp regression: reported ${reportedLedger} < previous ${lastRecordedLedger}`,
      'ORACLE_DATA_REGRESSION'
    );
  }

  return {
    price,
    timestampLedger: reportedLedger,
    recordedAtSeconds: Math.floor(Date.now() / 1000),
  };
}
