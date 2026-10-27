/**
 * Reject Current Ledger Eta Execution Engine (#979)
 *
 * Asserts strict timelock expiration condition:
 * - Rejects if currentLedger <= etaLedger (eta still in current ledger)
 * - Passes only when currentLedger > etaLedger
 */

export class TimelockNotExpiredError extends Error {
  readonly code = 'TIMELOCK_NOT_EXPIRED';
  constructor(currentLedger: number, etaLedger: number) {
    super(`[TIMELOCK_NOT_EXPIRED] Current ledger ${currentLedger} <= eta ledger ${etaLedger}`);
    this.name = 'TimelockNotExpiredError';
  }
}

export function validateExecutionEta(
  currentLedger: number,
  etaLedger: number,
): boolean {
  if (currentLedger <= etaLedger) {
    throw new TimelockNotExpiredError(currentLedger, etaLedger);
  }
  return true;
}
