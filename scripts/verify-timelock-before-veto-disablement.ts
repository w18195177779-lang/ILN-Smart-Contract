/**
 * Timelock Pre-condition Verification for Veto Disablement (#981)
 *
 * Asserts that admin veto power cannot be retired without an active timelock:
 * - Requires executionDelay >= minProductionDelay (17,280 ledgers)
 * - Fails closed with TIMELOCK_REQUIRED on unconfigured delay
 */

export const MIN_PRODUCTION_EXECUTION_DELAY_LEDGERS = 17280;

export class TimelockRequiredError extends Error {
  readonly code = 'TIMELOCK_REQUIRED';
  constructor(currentDelay: number, minRequired: number) {
    super(`[TIMELOCK_REQUIRED] Current delay (${currentDelay}) < min production delay (${minRequired})`);
    this.name = 'TimelockRequiredError';
  }
}

export function validateVetoDisablement(
  executionDelayLedgers: number,
  vetoPowerEnabled: boolean,
): boolean {
  if (!vetoPowerEnabled) {
    throw new Error('Veto power already disabled');
  }

  if (executionDelayLedgers < MIN_PRODUCTION_EXECUTION_DELAY_LEDGERS) {
    throw new TimelockRequiredError(
      executionDelayLedgers,
      MIN_PRODUCTION_EXECUTION_DELAY_LEDGERS
    );
  }

  return true;
}
