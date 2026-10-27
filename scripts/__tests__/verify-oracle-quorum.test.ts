import { describe, expect, it } from 'vitest';
import { enforceOracleQuorum, OracleQuorumError } from '../verify-oracle-quorum';

describe('Require Oracle Quorum (#1043)', () => {
  it('accepts when surviving oracles meet or exceed required quorum', () => {
    expect(enforceOracleQuorum(3, 3)).toBe(true);
    expect(enforceOracleQuorum(4, 3)).toBe(true);
  });

  it('rejects when surviving oracles are below required quorum', () => {
    expect(() => enforceOracleQuorum(2, 3)).toThrow(OracleQuorumError);
  });
});
