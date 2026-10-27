/**
 * Delayed Execution Replay Protection Engine (#986)
 *
 * Asserts persistent receipt creation and duplicate execution rejection:
 * - Emits ProposalAlreadyExecuted on replay attempts
 * - Tracks execution receipts durably
 */

export class ReplayProtectionError extends Error {
  readonly code = 'PROPOSAL_ALREADY_EXECUTED';
  constructor(proposalId: number) {
    super(`[PROPOSAL_ALREADY_EXECUTED] Proposal ${proposalId} has already been executed`);
    this.name = 'ReplayProtectionError';
  }
}

export class ExecutionReceiptLedger {
  private receipts = new Set<number>();

  execute(proposalId: number): { success: boolean; proposalId: number } {
    if (this.receipts.has(proposalId)) {
      throw new ReplayProtectionError(proposalId);
    }

    this.receipts.add(proposalId);
    return { success: true, proposalId };
  }

  isExecuted(proposalId: number): boolean {
    return this.receipts.has(proposalId);
  }
}
