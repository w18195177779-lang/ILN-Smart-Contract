import { describe, expect, it } from 'vitest';
import { applyVetoApproval, VetoConsentError, type VetoState } from '../verify-veto-consent';

describe('Require Explicit Consent for Veto Transitions (#988)', () => {
  it('initiates pending veto with initial reason hash', () => {
    const initial: VetoState = {
      status: 'Uninitiated',
      approvalsCount: 0,
      threshold: 2,
      reasonHash: '',
    };

    const next = applyVetoApproval(initial, 'SIGNER_A', '0xabc123');
    expect(next.status).toBe('Pending');
    expect(next.approvalsCount).toBe(1);
    expect(next.reasonHash).toBe('0xabc123');
  });

  it('rejects subsequent approval with mismatched reason hash', () => {
    const pending: VetoState = {
      status: 'Pending',
      approvalsCount: 1,
      threshold: 2,
      reasonHash: '0xabc123',
    };

    expect(() =>
      applyVetoApproval(pending, 'SIGNER_B', '0xconflicting999')
    ).toThrow(VetoConsentError);

    try {
      applyVetoApproval(pending, 'SIGNER_B', '0xconflicting999');
    } catch (e: any) {
      expect(e.code).toBe('VETO_REASON_MISMATCH');
    }
  });

  it('transitions to Executed when threshold reached with matching reason hash', () => {
    const pending: VetoState = {
      status: 'Pending',
      approvalsCount: 1,
      threshold: 2,
      reasonHash: '0xabc123',
    };

    const executed = applyVetoApproval(pending, 'SIGNER_B', '0xabc123');
    expect(executed.status).toBe('Executed');
    expect(executed.approvalsCount).toBe(2);
  });
});
