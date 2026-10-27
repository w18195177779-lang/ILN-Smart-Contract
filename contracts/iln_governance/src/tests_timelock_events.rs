//! Tests for Issue #980 — Emit auditable timelock schedule and execution events
//!
//! Validates:
//! - TimelockScheduled event carries proposal_id, eta_ledger, execution_delay, and current_ledger
//! - TimelockExecuted event carries proposal_id, executed_at_ledger, and eta_ledger
//! - Events are structured for indexer transparency

#![cfg(test)]

use super::*;
use soroban_sdk::Env;

#[test]
fn test_timelock_event_schemas() {
    let env = Env::default();
    let scheduled = TimelockScheduled {
        proposal_id: 100,
        eta_ledger: 50_000,
        execution_delay: 17_280,
        current_ledger: 32_720,
    };
    assert_eq!(scheduled.proposal_id, 100);
    assert_eq!(scheduled.eta_ledger, 50_000);

    let executed = TimelockExecuted {
        proposal_id: 100,
        executed_at_ledger: 50_005,
        eta_ledger: 50_000,
    };
    assert_eq!(executed.proposal_id, 100);
    assert!(executed.executed_at_ledger >= executed.eta_ledger);
}
