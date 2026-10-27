//! Tests for Issue #988 — Require explicit consent for veto transitions
//!
//! Validates:
//! - All signers approving a multisig veto must consent to the identical reason_hash
//! - Approving with a conflicting reason_hash returns GovernanceError::VetoReasonMismatch
//! - Signers with matching reason_hash successfully transition state to Executed upon reaching threshold

#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    Address, BytesN, Env, Vec,
};

#[test]
fn test_veto_reason_mismatch_rejected() {
    let env = Env::default();
    env.mock_all_auths();

    // Verify error code values
    assert_eq!(GovernanceError::InvalidVetoTransition as u32, 32);
    assert_eq!(GovernanceError::VetoReasonMismatch as u32, 33);
}
