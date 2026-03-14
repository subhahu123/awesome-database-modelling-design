---
title: "Job Board & Recruitment Database Modelling"
slug: /case-studies/job-board-recruitment-database-modelling
---

> Source: `job-board-recruitment-database-modelling/README.md`

# Job Board & Recruitment Database Modelling

## 1) Problem statement

Design a production-grade schema for **Job Board & Recruitment** with:

- correct relational constraints
- query-oriented indexes
- auditable state transitions
- a clear migration path from v1 to v2

---

## 2) Basic solution (v1)

A minimal starting model teams typically build first.

### Core entities (v1)

- `users`
- `primary_records`
- `record_items`

### Starter schema (v1)

```sql
CREATE TABLE users (
  user_id BIGINT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE primary_records (
  record_id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  status VARCHAR(30) NOT NULL,
  total_cents BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE record_items (
  item_id BIGINT PRIMARY KEY,
  record_id BIGINT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  amount_cents BIGINT NOT NULL DEFAULT 0,
  FOREIGN KEY (record_id) REFERENCES primary_records(record_id)
);
```

### Useful v1 indexes

```sql
CREATE INDEX idx_primary_records_user_created
  ON primary_records(user_id, created_at DESC);

CREATE INDEX idx_record_items_record
  ON record_items(record_id);
```

---

## 3) Design choices to question (what breaks in v1)

Typical problems in the basic design:

1. **No lifecycle history**: only current `status` is stored; transitions are not auditable.
2. **Weak idempotency**: retried external writes can create duplicates.
3. **No tenant boundary**: hard to isolate enterprise customers or regional data.
4. **Limited compliance traceability**: actor/source metadata is missing.
5. **Read/write coupling**: dashboards and transactional writes fight over same tables.

---

## 4) Improved solution (v2)

Upgrade v1 by adding lifecycle history, idempotency, and auditability.

### Added entities (v2)

- `record_status_history` (append-only transitions)
- `idempotency_keys` (dedupe retried writes)
- `audit_logs` (actor + action trail)

### Improved schema additions (v2)

```sql
CREATE TABLE record_status_history (
  record_id BIGINT NOT NULL,
  sequence_no INT NOT NULL,
  from_status VARCHAR(30),
  to_status VARCHAR(30) NOT NULL,
  changed_by BIGINT,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (record_id, sequence_no),
  FOREIGN KEY (record_id) REFERENCES primary_records(record_id)
);

CREATE TABLE idempotency_keys (
  idempotency_key VARCHAR(100) PRIMARY KEY,
  user_id BIGINT NOT NULL,
  request_hash VARCHAR(128) NOT NULL,
  response_ref VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE audit_logs (
  audit_id BIGINT PRIMARY KEY,
  entity_type VARCHAR(40) NOT NULL,
  entity_id BIGINT NOT NULL,
  actor_id BIGINT,
  action VARCHAR(40) NOT NULL,
  source VARCHAR(40),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Improved indexes (v2)

```sql
CREATE INDEX idx_primary_records_status_created
  ON primary_records(status, created_at DESC);

CREATE INDEX idx_status_history_record_time
  ON record_status_history(record_id, changed_at DESC);

CREATE INDEX idx_audit_entity_time
  ON audit_logs(entity_type, entity_id, created_at DESC);
```

---

## 5) Read/write patterns after the fix

- **Write path**: transactionally update `primary_records` + append `record_status_history`.
- **Retry-safe APIs**: check `idempotency_keys` before creating/updating records.
- **Operational forensics**: use `audit_logs` for investigations and compliance checks.
- **Read models**: optionally build denormalized projections for heavy dashboards.

---

## 6) Production notes

- Keep schema constraints as the source of truth for critical invariants.
- Prefer append-only history tables for reversible debugging and replay.
- Use online/backward-compatible migrations (`ADD COLUMN`, dual-write, then cleanup).
- Partition by tenant/time when volume grows.
