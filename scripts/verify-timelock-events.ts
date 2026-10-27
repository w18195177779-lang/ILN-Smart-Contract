/**
 * Timelock Auditable Events Verification Engine (#980)
 *
 * Simulates event lifecycle for timelocked proposals:
 * - TimelockScheduled: emitted upon entering timelock
 * - TimelockExecuted: emitted upon final execution
 */

export interface TimelockScheduledEvent {
  proposalId: number;
  etaLedger: number;
  executionDelay: number;
  currentLedger: number;
}

export interface TimelockExecutedEvent {
  proposalId: number;
  executedAtLedger: number;
  etaLedger: number;
}

export function buildScheduledEvent(
  proposalId: number,
  currentLedger: number,
  executionDelay: number,
): TimelockScheduledEvent {
  return {
    proposalId,
    etaLedger: currentLedger + executionDelay,
    executionDelay,
    currentLedger,
  };
}

export function buildExecutedEvent(
  proposalId: number,
  executedAtLedger: number,
  etaLedger: number,
): TimelockExecutedEvent {
  if (executedAtLedger < etaLedger) {
    throw new Error(`Premature execution attempt: ledger ${executedAtLedger} < eta ${etaLedger}`);
  }
  return {
    proposalId,
    executedAtLedger,
    etaLedger,
  };
}
