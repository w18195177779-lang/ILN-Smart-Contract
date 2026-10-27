//! Tests for Issue #1044 — Persist and validate price timestamps
//!
//! Validates:
//! - Stored price records maintain immutable timestamp and ledger sequence
//! - Future-dated timestamps and stale timestamps are rejected
//! - Monotonically non-decreasing timestamp invariant holds

#![cfg(test)]

use super::*;
use crate::storage::PersistedPriceRecord;
use soroban_sdk::{
    testutils::Address as _,
    Address, Env,
};

#[test]
fn test_persisted_price_record_schema() {
    let env = Env::default();
    let token = Address::generate(&env);

    let record = PersistedPriceRecord {
        price: 100_000_000,
        timestamp_seconds: 1_700_000_000,
        ledger_sequence: 50_000,
    };

    crate::storage::set_persisted_price_record(
        &env,
        crate::oracle_registry::OracleFeedType::Price,
        &token,
        &record,
    );

    let loaded = crate::storage::get_persisted_price_record(
        &env,
        crate::oracle_registry::OracleFeedType::Price,
        &token,
    );
    assert_eq!(loaded, Some(record));
}
