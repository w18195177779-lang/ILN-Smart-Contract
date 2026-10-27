import { describe, expect, it } from 'vitest';
import { buildScheduledEvent, buildExecutedEvent } from '../verify-timelock-events';

describe('Emit Auditable Timelock Schedule and Execution Events (#980)', () => {
  it('builds valid scheduled event', () => {
    const event = buildScheduledEvent(10, 1000, 500);
    expect(event.proposalId).toBe(10);
    expect(event.etaLedger).toBe(1500);
    expect(event.executionDelay).toBe(500);
    expect(event.currentLedger).toBe(1000);
  });

  it('builds valid executed event when ledger >= eta', () => {
    const event = buildExecutedEvent(10, 1505, 1500);
    expect(event.proposalId).toBe(10);
    expect(event.executedAtLedger).toBe(1505);
    expect(event.etaLedger).toBe(1500);
  });

  it('rejects premature executed event when ledger < eta', () => {
    expect(() => buildExecutedEvent(10, 1499, 1500)).toThrow('Premature execution attempt');
  });
});
