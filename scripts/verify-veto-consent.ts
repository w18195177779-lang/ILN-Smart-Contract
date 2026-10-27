/**
 * Veto Explicit Consent Verification Engine (#988)
 *
 * Verifies that multisig veto approvals require matching reason hashes:
 * - Prevents signers from approving conflicting veto justifications
 * - Ensures fail-closed transition on reason mismatch
 */

export class VetoConsentError extends Error {
  readonly code: string;
  constructor(message: string, code: string) {
    super(`[${code}] ${message}`);
    this.name = 'VetoConsentError';
    this.code = code;
  }
}

export interface VetoState {
  status: 'Uninitiated' | 'Pending' | 'Executed';
  approvalsCount: number;
  threshold: number;
  reasonHash: string;
}

export function applyVetoApproval(
  currentState: VetoState,
  signer: string,
  reasonHash: string,
): VetoState {
  if (currentState.status === 'Executed') {
    throw new VetoConsentError('Cannot approve an already executed veto', 'INVALID_VETO_TRANSITION');
  }

  if (currentState.status === 'Pending') {
    if (currentState.reasonHash !== reasonHash) {
      throw new VetoConsentError(
        `Veto reason hash mismatch: expected ${currentState.reasonHash}, got ${reasonHash}`,
        'VETO_REASON_MISMATCH'
      );
    }
  }

  const newApprovals = currentState.approvalsCount + 1;
  const newStatus = newApprovals >= currentState.threshold ? 'Executed' : 'Pending';

  return {
    status: newStatus,
    approvalsCount: newApprovals,
    threshold: currentState.threshold,
    reasonHash: currentState.status === 'Uninitiated' ? reasonHash : currentState.reasonHash,
  };
}
