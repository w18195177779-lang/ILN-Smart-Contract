import { describe, expect, it } from 'vitest';
import {
  bindTimelockPolicyVersion,
  validateTimelockPolicyVersion,
  CURRENT_TIMELOCK_POLICY_VERSION,
} from '../verify-timelock-policy-version';

describe('Persist Timelock Policy Version on Proposals (#982)', () => {
  it('binds current policy version by default', () => {
    const meta = bindTimelockPolicyVersion(42, 17280);
    expect(meta.proposalId).toBe(42);
    expect(meta.timelockPolicyVersion).toBe(CURRENT_TIMELOCK_POLICY_VERSION);
    expect(validateTimelockPolicyVersion(meta)).toBe(true);
  });

  it('rejects unsupported legacy or corrupted policy versions', () => {
    const meta = bindTimelockPolicyVersion(42, 17280, 999);
    expect(validateTimelockPolicyVersion(meta, [1])).toBe(false);
  });
});
