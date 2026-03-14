# Short Video Platform Database Modelling

## 1) Problem statement

Design a production-ready schema for a **Short Video Platform** system with clear transactional boundaries,
query-oriented indexes, and auditable state transitions.

## 2) Core entities

- `tenants`
- `accounts`
- `primary_records`
- `record_events`
- `payments_or_usage`
- `audit_logs`

## 3) Reference schema (starter)

```sql
CREATE TABLE primary_records (
  record_id BIGINT PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  owner_id BIGINT NOT NULL,
  status VARCHAR(30) NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE record_events (
  record_id BIGINT NOT NULL,
  sequence_no INT NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  event_payload JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (record_id, sequence_no),
  FOREIGN KEY (record_id) REFERENCES primary_records(record_id)
);

CREATE TABLE audit_logs (
  audit_id BIGINT PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  actor_id BIGINT,
  entity_type VARCHAR(40) NOT NULL,
  entity_id BIGINT NOT NULL,
  action VARCHAR(40) NOT NULL,
  occurred_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 4) Query-driven indexes

```sql
CREATE INDEX idx_records_tenant_status_created
  ON primary_records(tenant_id, status, created_at DESC);

CREATE INDEX idx_record_events_created
  ON record_events(record_id, created_at DESC);

CREATE INDEX idx_audit_logs_entity_time
  ON audit_logs(entity_type, entity_id, occurred_at DESC);
```

## 5) Design notes

- Use `record_events` for append-only history and replay.
- Keep business invariants in DB constraints where possible.
- Add idempotency keys on external write APIs.
- Partition by tenant or time for very large workloads.
