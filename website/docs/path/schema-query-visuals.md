---
id: schema-query-visuals
title: Schema & query visuals
slug: /path/schema-query-visuals
---

# Schema & query visuals

Yes — the site now supports **diagram plugins** for visualizing database tables and query flows.

## Mermaid support enabled

Use Mermaid blocks directly in docs pages:

```mermaid
erDiagram
  USERS ||--o{ ORDERS : places
  ORDERS ||--|{ ORDER_ITEMS : has
  PRODUCTS ||--o{ ORDER_ITEMS : referenced_by
```

## Query lifecycle flow

```mermaid
flowchart LR
  A[API Request] --> B[Validate Input]
  B --> C[Start Transaction]
  C --> D[Write Orders]
  D --> E[Write Order Items]
  E --> F[Commit]
  F --> G[Publish Outbox Event]
```

## Read path / index fit

```mermaid
flowchart TD
  Q[SELECT * FROM orders
WHERE customer_id=?
ORDER BY created_at DESC
LIMIT 20] --> I[(idx_orders_customer_created)]
  I --> R[Fast paginated response]
```

## How to use in case studies

- Add a Mermaid block under each case study section:
  - ER diagram for entities
  - write flow for transaction boundaries
  - read flow for index strategy
- Keep diagrams small and task-oriented for better readability.
