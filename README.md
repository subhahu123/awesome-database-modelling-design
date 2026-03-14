# Awesome Database Modelling & Design

A curated collection of practical database modelling references, schema patterns, and production-inspired examples.

> Inspired by awesome-style repositories (including `awesome-low-level-design`), this repo focuses on **real schema decisions** with trade-offs.

---

## Contents

- [How to use this repo](#how-to-use-this-repo)
- [Database modelling learning path](#database-modelling-learning-path)
- [Core modelling topics](#core-modelling-topics)
- [Schema patterns](#schema-patterns)
- [Real-world schema case studies](#real-world-schema-case-studies)
- [Practice prompts](#practice-prompts)
- [Design checklist](#design-checklist)
- [Contributing](#contributing)

---

## How to use this repo

1. Start with a case study close to your domain (payments, messaging, booking, CMS, etc.).
2. Understand entities, constraints, and indexing strategy.
3. Compare normalized source-of-truth tables vs denormalized read models.
4. Adapt table definitions based on your scale, consistency, and compliance requirements.
5. Use the practice prompts section to design variants and compare trade-offs.

---

## Database modelling learning path

### Beginner

- Identify entities, attributes, and relationships from product requirements.
- Learn when to use one-to-many, many-to-many, and weak entities.
- Practice writing `PRIMARY KEY`, `FOREIGN KEY`, `UNIQUE`, and `CHECK` constraints.

### Intermediate

- Translate APIs into query patterns and query patterns into indexes.
- Design transaction boundaries and idempotent write flows.
- Model soft-delete, audit columns, and historical snapshots.

### Advanced

- Build for multi-tenant workloads and regional sharding.
- Separate OLTP write models from analytics/read-optimized models.
- Design event/outbox + CDC patterns for async consistency.

---

## Core modelling topics

- **Entity modelling:** identifying aggregate boundaries, strong/weak entities.
- **Relational correctness:** PK/FK strategy, uniqueness, check constraints, cascades.
- **Performance patterns:** composite indexes, partial indexes, partitioning, read models.
- **Operational concerns:** migrations, backfills, auditability, soft delete, retention.
- **Scale trade-offs:** sharding keys, eventual consistency, idempotency, outbox/event logs.

---

## Schema patterns

- **Ledger-first systems:** immutable entries + derived balances (wallets, accounting).
- **Status history tables:** append-only lifecycle transitions for audit + replay.
- **Polymorphic ownership:** `entity_type + entity_id` for generalized attachment/comment tables.
- **Inbox/outbox pattern:** durable event publishing from transactional writes.
- **Materialized read models:** denormalized projections for low-latency reads.
- **Temporal modelling:** valid-time + transaction-time for compliance-sensitive domains.

---

## Real-world schema case studies

### Social / Community

- [Reddit Nested Comment](./Reddit%20Nested%20Comment/Readme.md)
- [Like-Reaction System (Facebook / LinkedIn style)](./Designing%20a%20Like-Reaction%20System%20(Facebook%20-%20LinkedIn)/Readme.md)

### Productivity / Collaboration

- [Google Calendar Modelling](./google-calendar-database-modelling/README.md)
- [Room Booking Modelling](./Room-Booking-Database-Modelling/README.md)

### Content / Media

- [WordPress Content Management System](./wp-content-management-system/README.md)
- [Music Streaming Service Modelling](./music-streaming-server/README.md)

### Developer Platforms

- [GitHub Database Modelling](./GitHub-Database-Modelling/README.md)

### Commerce / FinTech / Operations

- [E-Commerce Order + Inventory + Payment Modelling](./ecommerce-order-inventory-payment/README.md)
- [Ride Sharing (Uber/Ola style) Modelling](./ride-sharing-database-modelling/README.md)
- [Ledger-first Wallet / FinTech Modelling](./wallet-ledger-database-modelling/README.md)
- [Food Delivery (Swiggy/Zomato/UberEats style) Modelling](./food-delivery-database-modelling/README.md)

### Communication / Education

- [Messaging / Chat Application Modelling](./messaging-chat-database-modelling/README.md)
- [Learning Management System (LMS) Modelling](./learning-management-system-database-modelling/README.md)

---

## Practice prompts

Use these to extend the repository with your own schema exercises:

1. Design a **ticketing system** with seat locking, payment expiry, and refund workflows.
2. Model a **B2B SaaS billing platform** (plans, subscriptions, invoices, credit notes).
3. Build a **logistics dispatch system** with fleet assignment and route stop updates.
4. Design a **feature flag platform** with rollout rules and audit history.
5. Model a **short-video app** with feed ranking features, likes, and moderation actions.

---

## Design checklist

Use this before freezing schema v1:

- [ ] Business invariants encoded with constraints (not only app code).
- [ ] Idempotency keys for retriable write APIs.
- [ ] Clear ownership for counters and materialized/derived tables.
- [ ] Indexes align with top read paths and sort orders.
- [ ] Migrations are forward/backward compatible.
- [ ] Audit/compliance fields included (`created_at`, `updated_at`, actor, source).
- [ ] Archival/TTL strategy documented.
- [ ] Multi-tenant boundaries explicitly modeled (`tenant_id` everywhere needed).
- [ ] PII classification + masking/encryption strategy documented.
- [ ] Backfill and rollback plan documented for every major migration.

---

## Contributing

Contributions are welcome.

Good additions include:

- New production-inspired schema case studies.
- SQL DDL with rationale and indexing notes.
- Alternative designs with trade-off comparison.
- Query patterns and migration playbooks.
- Known pitfalls and anti-patterns observed in production.

If you add a case study, keep the README structure simple:

1. Problem statement
2. Core entities
3. SQL schema
4. Read/write patterns
5. Scaling and consistency notes

---

If this helps you, consider starring the repository ⭐
