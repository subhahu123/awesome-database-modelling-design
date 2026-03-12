# 50+ Database Modelling Problems (Practice Catalog)

Use this catalog like `awesome-low-level-design` style practice: pick a problem, design core entities, write DDL, add indexes, and document trade-offs.

## How to practice each problem

1. Define invariants (what must always be true).
2. Design write-path tables first (source of truth).
3. Add read models/materialized views only for proven queries.
4. Add index strategy from real query patterns.
5. Document scaling + consistency decisions.

---

## Social / Community (1-10)

1. **Follow/Unfollow System** — users, follows, follower_count, privacy controls.
2. **News Feed Fanout** — posts, feed_items, delivery queues, ranking snapshots.
3. **Comments + Nested Threads** — adjacency list vs closure table vs materialized path.
4. **Post Reactions** — reaction source-of-truth + counters + event log.
5. **Story/Status Expiry** — ephemeral content, TTL, view receipts.
6. **Hashtag Search** — post_tags bridge tables, inverted indexes, trend windows.
7. **User Mentions** — mention extraction, notification fanout, reference integrity.
8. **Blocking / Muting** — edge relationships with feed and messaging filters.
9. **Abuse Reports** — reports, moderation queue, evidence snapshots.
10. **Community Groups** — memberships, roles, permission inheritance.

## Messaging / Real-time (11-20)

11. **1:1 Chat** — conversation identity, message ordering, delivery guarantees.
12. **Group Chat** — membership history, role-based permissions, join/leave timeline.
13. **Message Receipts** — delivered/read by user and device.
14. **Threaded Replies** — parent-child message trees with pagination.
15. **Attachment Storage Metadata** — object keys, scan status, retention.
16. **Message Edit/Delete History** — mutable text with immutable audit trail.
17. **Typing Presence** — short-lived presence with cache + durable fallback.
18. **Push Notification Queue** — dedupe keys, retry states, dead-letter handling.
19. **Broadcast Channels** — publishers/subscribers, unread snapshots.
20. **Spam Detection Signals** — content fingerprints and account risk features.

## E-commerce / Marketplace (21-35)

21. **Product Catalog** — products, variants, attributes, category trees.
22. **Inventory Reservations** — hold/confirm/release workflow with expiry.
23. **Shopping Cart** — cart versioning, merges, price freshness.
24. **Order Lifecycle** — pending, confirmed, packed, shipped, returned.
25. **Payment Attempts** — idempotency keys and provider callbacks.
26. **Refunds + Partial Refunds** — line-item vs order-level reversals.
27. **Coupon Engine** — rules, eligibility, redemptions, anti-abuse controls.
28. **Seller Marketplace** — multi-vendor orders and payout splits.
29. **Shipping + Tracking** — shipment legs, carrier events, status projection.
30. **Returns/RMA** — return reasons, inspection outcomes, restocking.
31. **Wishlist** — user lists with stock/price alert subscriptions.
32. **Product Reviews** — verified purchase checks and moderation flags.
33. **Search Facets** — denormalized facet indexes and reindex pipelines.
34. **Flash Sales** — limited stock, reservation race conditions, throttling.
35. **Subscription Commerce** — recurring orders, plan changes, retries.

## FinTech / Ledger / Payments (36-45)

36. **Wallet Ledger** — double-entry ledger and account hierarchy.
37. **Bank Transfer Rail** — initiation, settlement, return/reversal states.
38. **Card Authorization/Capture** — auth holds, captures, voids.
39. **Payouts to Merchants** — settlement windows and reconciliation.
40. **KYC/KYB Workflow** — verification attempts, document versions.
41. **Fraud Rules Engine** — decision logs, features, rule versioning.
42. **Chargebacks** — dispute stages, evidence records, outcomes.
43. **Multi-currency Wallets** — FX rates, conversion transactions.
44. **Escrow Transactions** — hold/release conditions, arbitration.
45. **Transaction Reconciliation** — internal vs provider ledger matching.

## Mobility / Booking / Scheduling (46-55)

46. **Ride Matching** — rider requests, driver candidates, assignment state.
47. **Driver Location Stream** — raw events + latest location projection.
48. **Trip Pricing** — base fare, surge components, adjustments.
49. **Room Booking Calendar** — slot collisions, soft holds, confirmations.
50. **Hotel Reservation** — room inventory, overbooking policy, cancellations.
51. **Flight Seat Inventory** — fare classes, seat maps, lock windows.
52. **Doctor Appointment Booking** — provider slots, recurring schedules.
53. **Event Ticketing** — seat/zone inventory, anti-bot constraints.
54. **Car Rental** — vehicle availability, damage reports, add-ons.
55. **Delivery Slot Allocation** — capacity planning by zone/time.

## Enterprise / Analytics / Infra (56-65)

56. **CMS Content Versioning** — drafts, publish workflow, rollback.
57. **Audit Logging System** — immutable actor/action/object trails.
58. **Feature Flag Platform** — flags, targeting rules, rollout history.
59. **SaaS Multi-Tenancy** — tenant isolation and shared tables.
60. **Role-Based Access Control** — roles, permissions, scoped grants.
61. **API Rate Limiting Data Model** — tokens, windows, key dimensions.
62. **Outbox + CDC Pattern** — transactional outbox and consumer checkpoints.
63. **ETL Job Metadata** — job runs, lineage, retries, SLAs.
64. **Data Warehouse Star Schema** — dimensions, slowly changing dimensions.
65. **IoT Telemetry Storage** — high-volume time-series partitioning.

---

## Suggested output template per problem

- **Problem statement**
- **Core entities and relationships**
- **DDL (source-of-truth)**
- **Indexes (query-driven)**
- **Read model / cache strategy**
- **Consistency model**
- **Migration + backfill plan**
- **Failure modes and recovery**

---

If you want, convert any numbered item into a full case-study README in this repository.
