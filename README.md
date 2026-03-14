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

## Massive case study catalog (50 new additions)

- [Ad Tech Real-Time Bidding Modelling](./ad-tech-bidding-database-modelling/README.md)
- [Airline Reservation Modelling](./airline-reservation-database-modelling/README.md)
- [API Rate Limiting Modelling](./api-rate-limiting-database-modelling/README.md)
- [Audit Log & Compliance Modelling](./audit-log-compliance-database-modelling/README.md)
- [Banking Core Ledger Modelling](./banking-core-ledger-database-modelling/README.md)
- [B2B CRM Modelling](./b2b-crm-database-modelling/README.md)
- [B2B Marketplace Modelling](./b2b-marketplace-database-modelling/README.md)
- [Car Rental Modelling](./car-rental-database-modelling/README.md)
- [Crypto Exchange Modelling](./crypto-exchange-database-modelling/README.md)
- [Customer Support Helpdesk Modelling](./customer-support-helpdesk-database-modelling/README.md)
- [Digital Library Modelling](./digital-library-database-modelling/README.md)
- [Doctor Appointment Modelling](./doctor-appointment-database-modelling/README.md)
- [Donation & Crowdfunding Modelling](./donation-crowdfunding-database-modelling/README.md)
- [E-learning Live Classes Modelling](./e-learning-live-classes-database-modelling/README.md)
- [Email Delivery Platform Modelling](./email-delivery-platform-database-modelling/README.md)
- [Event Ticketing Modelling](./event-ticketing-database-modelling/README.md)
- [Expense Management Modelling](./expense-management-database-modelling/README.md)
- [Feature Flag Platform Modelling](./feature-flag-platform-database-modelling/README.md)
- [Fitness Tracking Modelling](./fitness-tracking-database-modelling/README.md)
- [Fraud Risk Engine Modelling](./fraud-risk-engine-database-modelling/README.md)
- [Gaming Leaderboard Modelling](./gaming-leaderboard-database-modelling/README.md)
- [Grocery Quick Commerce Modelling](./grocery-quick-commerce-database-modelling/README.md)
- [Hotel Management Modelling](./hotel-management-database-modelling/README.md)
- [HR & Payroll Modelling](./hr-payroll-database-modelling/README.md)
- [Insurance Policy & Claims Modelling](./insurance-policy-claims-database-modelling/README.md)
- [IoT Device Telemetry Modelling](./iot-device-telemetry-database-modelling/README.md)
- [Job Board & Recruitment Modelling](./job-board-recruitment-database-modelling/README.md)
- [Knowledge Base / Wiki Modelling](./knowledge-base-wiki-database-modelling/README.md)
- [Loan Origination Modelling](./loan-origination-database-modelling/README.md)
- [Logistics & Warehouse Modelling](./logistics-warehouse-database-modelling/README.md)
- [Meal Subscription Modelling](./meal-subscription-database-modelling/README.md)
- [Microblogging Social Feed Modelling](./microblogging-social-feed-database-modelling/README.md)
- [Notification Platform Modelling](./notification-platform-database-modelling/README.md)
- [Observability Metrics & Logs Modelling](./observability-metrics-logs-database-modelling/README.md)
- [Online Exam & Proctoring Modelling](./online-exam-proctoring-database-modelling/README.md)
- [Parking Management Modelling](./parking-management-database-modelling/README.md)
- [Pharmacy Management Modelling](./pharmacy-management-database-modelling/README.md)
- [Project Management Modelling](./project-management-database-modelling/README.md)
- [Real Estate Listings Modelling](./real-estate-listings-database-modelling/README.md)
- [Restaurant POS Modelling](./restaurant-pos-database-modelling/README.md)
- [SaaS Subscription Billing Modelling](./saas-subscription-billing-database-modelling/README.md)
- [School Management Modelling](./school-management-database-modelling/README.md)
- [Search Indexing Modelling](./search-indexing-database-modelling/README.md)
- [Shipment Tracking Modelling](./shipment-tracking-database-modelling/README.md)
- [Short Video Platform Modelling](./short-video-platform-database-modelling/README.md)
- [Sports Fantasy League Modelling](./sports-fantasy-league-database-modelling/README.md)
- [Telemedicine Modelling](./telemedicine-database-modelling/README.md)
- [Travel Itinerary Booking Modelling](./travel-itinerary-booking-database-modelling/README.md)
- [Video Conferencing Modelling](./video-conferencing-database-modelling/README.md)
- [Voting & Polling System Modelling](./voting-polling-system-database-modelling/README.md)


## Practice prompts

Use these to extend the repository with your own schema exercises:

1. Design a **ticketing system** with seat locking, payment expiry, and refund workflows.
2. Model a **B2B SaaS billing platform** (plans, subscriptions, invoices, credit notes).
3. Build a **logistics dispatch system** with fleet assignment and route stop updates.
4. Design a **feature flag platform** with rollout rules and audit history.
5. Model a **short-video app** with feed ranking features, likes, and moderation actions.

---


## Blog-style learning site (Docusaurus 2)

The learning site now runs on **Docusaurus 2** under `website/`.

- Config: `website/docusaurus.config.js`
- Sidebar: `website/sidebars.js`
- Learn docs: `website/docs/in-a-hurry/*`
- Blog posts: `website/blog/*` (auto-imported from case-study READMEs)

Run locally:

```bash
cd website
npm install
npm run start
```

Open `http://localhost:3000/awesome-database-modelling-design/`.

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
