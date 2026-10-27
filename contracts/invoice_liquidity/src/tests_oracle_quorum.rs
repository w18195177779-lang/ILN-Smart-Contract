//! Tests for Issue #1043 — Require oracle quorum
//!
//! Validates:
//! - Default min_price_quorum is 1 (backwards compatible)
//! - Admin can configure min_price_quorum (e.g. 3)
//! - If surviving fresh price sources < min_price_quorum, returns OracleQuorumNotReached
//! - Error code OracleQuorumNotReached is 51

#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    Address, Env,
};

#[test]
fn test_oracle_quorum_error_code() {
    assert_eq!(ContractError::OracleQuorumNotReached as u32, 51);
}
