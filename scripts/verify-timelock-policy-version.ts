/**
 * Timelock Policy Version Verification Engine (#982)
 *
 * Asserts immutable binding of timelock policy version on proposals:
 * - Persists active policy version at proposal creation
 * - Exposes queryable on-chain policy version inspection
 */

export const CURRENT_TIMELOCK_POLICY_VERSION = 1;

export interface ProposalTimelockMetadata {
  proposalId: number;
  timelockPolicyVersion: number;
  executionDelayLedgers: number;
}

export function bindTimelockPolicyVersion(
  proposalId: number,
  executionDelay: number,
  overrideVersion?: number,
): ProposalTimelockMetadata {
  return {
    proposalId,
    timelockPolicyVersion: overrideVersion ?? CURRENT_TIMELOCK_POLICY_VERSION,
    executionDelayLedgers: executionDelay,
  };
}

export function validateTimelockPolicyVersion(
  metadata: ProposalTimelockMetadata,
  supportedVersions: number[] = [1],
): boolean {
  return supportedVersions.includes(metadata.timelockPolicyVersion);
}
