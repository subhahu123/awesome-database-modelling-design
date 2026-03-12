# Wallet / Ledger-first FinTech Database Modelling

## 1) Principles

- Never update balance as source of truth without ledger entries.
- Use double-entry transactions to preserve accounting invariants.
- Make writes idempotent and auditable.

## 2) Reference schema

```sql
CREATE TABLE accounts (
  account_id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  account_type VARCHAR(20) NOT NULL, -- WALLET, ESCROW, FEES
  currency CHAR(3) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, account_type, currency)
);

CREATE TABLE ledger_transactions (
  txn_id BIGINT PRIMARY KEY,
  external_ref VARCHAR(128) UNIQUE NOT NULL,
  txn_type VARCHAR(30) NOT NULL, -- TOPUP, TRANSFER, WITHDRAWAL, REFUND
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ledger_entries (
  entry_id BIGINT PRIMARY KEY,
  txn_id BIGINT NOT NULL,
  account_id BIGINT NOT NULL,
  direction VARCHAR(6) NOT NULL, -- DEBIT | CREDIT
  amount_minor BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (txn_id) REFERENCES ledger_transactions(txn_id),
  FOREIGN KEY (account_id) REFERENCES accounts(account_id)
);
```

## 3) Constraints and checks

- For each `txn_id`, sum(credits) must equal sum(debits).
- Currency of all entries in a transaction must match.
- `external_ref` ensures API retry safety.

## 4) Read model

Optional denormalized table for balance reads:

```sql
CREATE TABLE account_balance_snapshot (
  account_id BIGINT PRIMARY KEY,
  balance_minor BIGINT NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

Rebuild this snapshot from `ledger_entries` when needed.
