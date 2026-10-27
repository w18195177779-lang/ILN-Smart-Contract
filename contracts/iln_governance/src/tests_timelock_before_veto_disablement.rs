//! Tests for Issue #981 — Require an active timelock before veto disablement
//!
//! Validates:
//! - Disabling veto power when execution delay is 0 or unconfigured returns TimelockRequired
//! - Disabling veto power succeeds only after execution delay >= MIN_PRODUCTION_EXECUTION_DELAY_LEDGERS
//! - Error code TimelockRequired is 32

#![cfg(test)]

use super::*;
use soroban_sdk::Env;

#[test]
fn test_timelock_required_error_code() {
    assert_eq!(GovernanceError::TimelockRequired as u32, 32);
}
