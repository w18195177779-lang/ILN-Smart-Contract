import { describe, expect, it } from 'vitest';
import { validateExecutionEta, TimelockNotExpiredError } from '../verify-reject-current-ledger-eta';

describe('Reject Execution Whose Eta is in Current Ledger (#979)', () => {
  it('rejects execution when current ledger exactly equals eta ledger', () => {
    expect(() => validateExecutionEta(5000, 5000)).toThrow(TimelockNotExpiredError);
  });

  it('rejects execution when current ledger is prior to eta ledger', () => {
    expect(() => validateExecutionEta(4999, 5000)).toThrow(TimelockNotExpiredError);
  });

  it('permits execution strictly after eta ledger has elapsed', () => {
    expect(validateExecutionEta(5001, 5000)).toBe(true);
    expect(validateExecutionEta(6000, 5000)).toBe(true);
  });
});
