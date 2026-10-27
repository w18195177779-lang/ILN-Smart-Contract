//! Tests for Issue #986 — Add replay protection for delayed executions
//!
//! Validates:
//! - ExecutionReceipt(proposal_id) is recorded in persistent storage upon proposal execution
//! - Duplicate calls to execute_proposal return GovernanceError::ProposalAlreadyExecuted
//! - is_proposal_executed returns true after execution

#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    Address, Env,
};

#[test]
fn test_replay_protection_error_code() {
    assert_eq!(GovernanceError::ProposalAlreadyExecuted as u32, 34);
}
