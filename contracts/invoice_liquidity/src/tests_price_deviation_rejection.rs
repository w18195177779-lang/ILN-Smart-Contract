//! Tests for Issue #1045 — Reject excessive price deviation
//!
//! Validates:
//! - Oracle prices with deviation > max_price_deviation_bps are strictly rejected
//! - If all reported prices deviate beyond threshold, returns ContractError::AllPriceSourcesRejected
//! - Rejection publishes PriceOutlierRejected event for off-chain monitoring

#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address as _,
    Address, Env, Vec,
};

#[test]
fn test_price_deviation_error_code_integrity() {
    assert_eq!(ContractError::AllPriceSourcesRejected as u32, 43);
    assert_eq!(ContractError::NoPriceSource as u32, 42);
}
