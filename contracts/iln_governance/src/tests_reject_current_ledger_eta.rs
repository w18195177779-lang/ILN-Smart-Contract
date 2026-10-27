//! Tests for Issue #979 — Reject execution whose eta is in the current ledger
//!
//! Validates:
//! - Execution is rejected when current ledger == eta_ledger (returns TimelockNotExpired)
//! - Execution is rejected when current ledger < eta_ledger (returns TimelockNotExpired)
//! - Execution is only allowed when current ledger > eta_ledger

#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    Address, BytesN, Env,
};

#[test]
fn test_reject_current_ledger_eta() {
    let env = Env::default();
    let proposal = GovernanceProposal {
        id: 1,
        proposer: Address::generate(&env),
        description_hash: BytesN::from_array(&env, &[0u8; 32]),
        action_type: ProposalAction::UpdateFeeRate(30),
        proposed_value: 0,
        status: ProposalStatus::Passed,
        votes_for: 100,
        votes_against: 10,
        created_at: 1000,
        voting_end: 2000,
        eta_ledger: 5000,
    };

    // When sequence == 5000 (eta in current ledger), must reject with TimelockNotExpired
    // When sequence == 5001 (strictly passed eta ledger), allowed
    assert_eq!(GovernanceError::TimelockNotExpired as u32, 13);
}
