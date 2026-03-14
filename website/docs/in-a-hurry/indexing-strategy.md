---
id: indexing-strategy
title: Indexing strategy
slug: /in-a-hurry/indexing-strategy
---

# Indexing strategy: design from queries

Every index should justify its write overhead through a critical read path.

## Workflow

1. List high-traffic read APIs and their SQL shape.
2. Build composite indexes in filter + sort order.
3. Benchmark with realistic data.
4. Remove stale/redundant indexes.

## Example

```sql
SELECT * FROM orders
WHERE customer_id = ?
ORDER BY created_at DESC
LIMIT 20;

CREATE INDEX idx_orders_customer_created
ON orders(customer_id, created_at DESC);
```

## Anti-patterns

- Indexing every column independently.
- Ignoring sort direction.
- Never revisiting indexes as workload evolves.
