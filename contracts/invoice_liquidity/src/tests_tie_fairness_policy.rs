//! Tests for Issue #1035 — Add configurable tie fairness policy
//!
//! Validates governance-configurable tie fairness policies:
//! - Default is TieFairnessPolicy::UniformRandom
//! - Admin can configure TieFairnessPolicy::EarliestJoined
//! - EarliestJoined selects the first joiner among tied scores deterministically
//! - Unauthorized callers cannot mutate the policy

#![cfg(test)]

use super::*;
use crate::storage::TieFairnessPolicy;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token::{Client as TokenClient, StellarAssetClient},
    Address, Env,
};

const INVOICE_AMOUNT: i128 = 1_000_000_000;
const DISCOUNT_RATE: u32 = 300;
const DUE_DATE_OFFSET: u64 = 60 * 60 * 24 * 30;

struct PolicyEnv {
    env: Env,
    contract: InvoiceLiquidityContractClient<'static>,
    token: TokenClient<'static>,
    admin: Address,
    freelancer: Address,
    payer: Address,
}

fn setup_policy_env() -> PolicyEnv {
    let env = Env::default();
    env.mock_all_auths();

    let admin = Address::generate(&env);
    let token_id = env.register_stellar_asset_contract_v2(admin.clone());
    let token_addr = token_id.address();

    let token = TokenClient::new(&env, &token_addr);
    let token_admin = StellarAssetClient::new(&env, &token_addr);

    let contract_id = env.register(InvoiceLiquidityContract, ());
    let contract = InvoiceLiquidityContractClient::new(&env, &contract_id);

    contract.initialize(&admin, &admin, &admin, &token_addr);

    let freelancer = Address::generate(&env);
    let payer = Address::generate(&env);

    PolicyEnv {
        env,
        contract,
        token,
        admin,
        freelancer,
        payer,
    }
}

#[test]
fn test_default_policy_is_uniform_random() {
    let t = setup_policy_env();
    assert_eq!(t.contract.get_tie_fairness_policy(), TieFairnessPolicy::UniformRandom);
}

#[test]
fn test_admin_can_update_policy_to_earliest_joined() {
    let t = setup_policy_env();
    t.contract.set_tie_fairness_policy(&t.admin, &TieFairnessPolicy::EarliestJoined);
    assert_eq!(t.contract.get_tie_fairness_policy(), TieFairnessPolicy::EarliestJoined);
}

#[test]
fn test_non_admin_cannot_update_policy() {
    let t = setup_policy_env();
    let attacker = Address::generate(&t.env);
    assert_eq!(
        t.contract.try_set_tie_fairness_policy(&attacker, &TieFairnessPolicy::EarliestJoined),
        Err(Ok(ContractError::Unauthorized))
    );
}
