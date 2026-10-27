import { describe, expect, it } from 'vitest';
import {
  ExecutionReceiptLedger,
  ReplayProtectionError,
} from '../verify-delayed-execution-replay';

describe('Delayed Execution Replay Protection (#986)', () => {
  it('executes a proposal cleanly on first call', () => {
    const ledger = new ExecutionReceiptLedger();
    const res = ledger.execute(101);

    expect(res.success).toBe(true);
    expect(res.proposalId).toBe(101);
    expect(ledger.isExecuted(101)).toBe(true);
  });

  it('rejects duplicate execution replay with ReplayProtectionError', () => {
    const ledger = new ExecutionReceiptLedger();
    ledger.execute(101);

    expect(() => ledger.execute(101)).toThrow(ReplayProtectionError);
  });
});
