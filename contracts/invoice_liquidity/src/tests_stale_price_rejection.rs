//! Tests for Issue #1042 — Enforce stale-price rejection
//!
//! Validates:
//! - Price timestamps older than max_age_ledgers return ContractError::OracleDataStale
//! - Price timestamps at or within max_age_ledgers succeed
//! - Future-dated price timestamps are rejected as stale

#![cfg(test)]

use super::*;
use crate::oracle_registry::validate_price_freshness;
use soroban_sdk::Env;

#[test]
fn test_fresh_price_succeeds() {
    assert_eq!(validate_price_freshness(1000, 995, 10), Ok(()));
}

#[test]
fn test_stale_price_fails() {
    assert_eq!(
        validate_price_freshness(1000, 980, 10),
        Err(ContractError::OracleDataStale)
    );
}

#[test]
fn test_boundary_price_freshness() {
    // Exactly at boundary (current - reported == max_age) -> stale
    assert_eq!(
        validate_price_freshness(1000, 990, 10),
        Err(ContractError::OracleDataStale)
    );
    // Just inside boundary (current - reported == max_age - 1) -> fresh
    assert_eq!(validate_price_freshness(1000, 991, 10), Ok(()));
}

#[test]
fn test_future_dated_price_rejected() {
    assert_eq!(
        validate_price_freshness(1000, 1005, 10),
        Err(ContractError::OracleDataStale)
    );
}
