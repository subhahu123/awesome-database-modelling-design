# Awesome Database Modelling & Design

A curated collection of practical database modelling references, schema patterns, and production-inspired examples.

> Inspired by awesome-style repositories (including `awesome-low-level-design`), this repo focuses on **real schema decisions** with trade-offs.

---

## Contents

- [How to use this repo](#how-to-use-this-repo)
- [Core modelling topics](#core-modelling-topics)
- [Real-world schema case studies](#real-world-schema-case-studies)
- [Design checklist](#design-checklist)
- [Contributing](#contributing)

---

## How to use this repo

1. Start with a case study close to your domain (payments, messaging, booking, CMS, etc.).
2. Understand entities, constraints, and indexing strategy.
3. Compare normalized source-of-truth tables vs denormalized read models.
4. Adapt table definitions based on your scale, consistency, and compliance requirements.

---

## Core modelling topics

- **Entity modelling:** identifying aggregate boundaries, strong/weak entities.
- **Relational correctness:** PK/FK strategy, uniqueness, check constraints, cascades.
- **Performance patterns:** composite indexes, partial indexes, partitioning, read models.
- **Operational concerns:** migrations, backfills, auditability, soft delete, retention.
- **Scale trade-offs:** sharding keys, eventual consistency, idempotency, outbox/event logs.

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

### New additions

- [E-Commerce Order + Inventory + Payment Modelling](./ecommerce-order-inventory-payment/README.md)
- [Messaging / Chat Application Modelling](./messaging-chat-database-modelling/README.md)
- [Ride Sharing (Uber/Ola style) Modelling](./ride-sharing-database-modelling/README.md)
- [Ledger-first Wallet / FinTech Modelling](./wallet-ledger-database-modelling/README.md)

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
- [ ] Multi-tenant boundaries explicitly modeled (tenant_id everywhere needed).

---

## Contributing

Contributions are welcome.

Good additions include:

- New production-inspired schema case studies.
- SQL DDL with rationale and indexing notes.
- Alternative designs with trade-off comparison.
- Query patterns and migration playbooks.

If you add a case study, keep the README structure simple:

1. Problem statement
2. Core entities
3. SQL schema
4. Read/write patterns
5. Scaling and consistency notes

---

If this helps you, consider starring the repository ⭐
