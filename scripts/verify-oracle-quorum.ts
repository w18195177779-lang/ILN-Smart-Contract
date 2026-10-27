/**
 * Oracle Quorum Verification Engine (#1043)
 *
 * Enforces minimum oracle quorum thresholds:
 * - Rejects prices if active surviving oracles < minQuorum
 * - Throws ORACLE_QUORUM_NOT_REACHED when threshold fails
 */

export class OracleQuorumError extends Error {
  readonly code = 'ORACLE_QUORUM_NOT_REACHED';
  constructor(survivors: number, required: number) {
    super(`[ORACLE_QUORUM_NOT_REACHED] Surviving oracles (${survivors}) < required quorum (${required})`);
    this.name = 'OracleQuorumError';
  }
}

export function enforceOracleQuorum(
  survivingOraclesCount: number,
  requiredQuorum: number = 1,
): boolean {
  if (survivingOraclesCount < requiredQuorum) {
    throw new OracleQuorumError(survivingOraclesCount, requiredQuorum);
  }
  return true;
}
