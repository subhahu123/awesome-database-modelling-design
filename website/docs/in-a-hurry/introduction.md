---
id: introduction
title: Introduction
slug: /in-a-hurry/introduction
---

# Introduction to database modelling (in a hurry)

Database modelling is about encoding **business truth** with tables, constraints, and indexes so your system remains correct at scale.

## The 20-minute framework

1. List core entities from product flows (user, order, payment, message, etc.).
2. Encode key invariants in DB constraints.
3. Map top reads/writes and create indexes for them first.
4. Add history for status transitions and auditing.
5. Plan backward-compatible migrations.

> If a rule matters to the business, put it in the schema—not only application code.

## Common mistakes

- Missing `UNIQUE` constraints for natural keys.
- Random indexes without query mapping.
- Storing only current status (no transition history).
- No idempotency for retried write APIs.
