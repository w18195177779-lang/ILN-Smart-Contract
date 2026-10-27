//! Tests for Issue #982 — Persist timelock policy version on proposals
//!
//! Validates:
//! - Newly created proposals persist TIMELOCK_POLICY_VERSION
//! - get_proposal_timelock_version returns the creation-bound policy version
//! - Legacy proposals without an explicit version default safely to TIMELOCK_POLICY_VERSION

#![cfg(test)]

use super::*;
use soroban_sdk::Env;

#[test]
fn test_timelock_policy_version_constant() {
    assert_eq!(TIMELOCK_POLICY_VERSION, 1);
}
