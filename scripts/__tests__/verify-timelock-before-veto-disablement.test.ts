import { describe, expect, it } from 'vitest';
import {
  validateVetoDisablement,
  TimelockRequiredError,
  MIN_PRODUCTION_EXECUTION_DELAY_LEDGERS,
} from '../verify-timelock-before-veto-disablement';

describe('Require Active Timelock Before Veto Disablement (#981)', () => {
  it('rejects veto disablement when delay is zero or insufficient', () => {
    expect(() => validateVetoDisablement(0, true)).toThrow(TimelockRequiredError);
    expect(() => validateVetoDisablement(1000, true)).toThrow(TimelockRequiredError);
  });

  it('permits veto disablement when production timelock is fully active', () => {
    expect(
      validateVetoDisablement(MIN_PRODUCTION_EXECUTION_DELAY_LEDGERS, true)
    ).toBe(true);
    expect(validateVetoDisablement(20000, true)).toBe(true);
  });
});
