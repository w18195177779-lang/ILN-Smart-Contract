/**
 * Stale Price Rejection Engine (#1042)
 *
 * Enforces price freshness invariants:
 * - Rejects prices older than maxAgeLedgers
 * - Rejects future-dated prices
 * - Accepts fresh prices within threshold
 */

export class StalePriceError extends Error {
  readonly code = 'ORACLE_DATA_STALE';
  constructor(age: number, maxAge: number) {
    super(`[ORACLE_DATA_STALE] Price data age (${age} ledgers) exceeds max allowable (${maxAge} ledgers)`);
    this.name = 'StalePriceError';
  }
}

export function enforcePriceFreshness(
  currentLedger: number,
  priceTimestampLedger: number,
  maxAgeLedgers: number,
): boolean {
  if (priceTimestampLedger > currentLedger) {
    throw new StalePriceError(currentLedger - priceTimestampLedger, maxAgeLedgers);
  }

  const age = currentLedger - priceTimestampLedger;
  if (age >= maxAgeLedgers) {
    throw new StalePriceError(age, maxAgeLedgers);
  }

  return true;
}
