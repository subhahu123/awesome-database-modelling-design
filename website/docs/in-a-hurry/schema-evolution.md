---
id: schema-evolution
title: Schema evolution
slug: /in-a-hurry/schema-evolution
---

# Schema evolution: v1 to v2

Most teams start with a minimal schema and evolve it under load.

## Basic v1 pattern

- One mutable status column
- Minimal constraints
- No lifecycle history

## Question the design

1. Can retries create duplicates?
2. Can we reconstruct who changed status and when?
3. Can we isolate tenant/regional data?
4. Can we safely backfill and roll back?

## Improve to v2

- Add append-only `status_history`.
- Add `idempotency_keys`.
- Add `audit_logs` with actor/source.
- Build read models for dashboard-heavy traffic.

## Safe migration playbook

1. Expand schema (additive changes).
2. Dual write old + new model.
3. Backfill old rows in batches.
4. Shift reads to v2.
5. Remove old columns later.
