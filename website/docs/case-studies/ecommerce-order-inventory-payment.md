---
title: "E-Commerce: Order + Inventory + Payment Database Modelling"
slug: /case-studies/ecommerce-order-inventory-payment
---

> Source: `ecommerce-order-inventory-payment/README.md`

# E-Commerce: Order + Inventory + Payment Database Modelling

## 1) Core entities

- `users`, `addresses`
- `products`, `product_variants`
- `inventory_reservations`
- `carts`, `cart_items`
- `orders`, `order_items`
- `payments`, `payment_events`

## 2) Reference schema (MySQL/PostgreSQL-friendly)

```sql
CREATE TABLE users (
  user_id BIGINT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_variants (
  variant_id BIGINT PRIMARY KEY,
  product_id BIGINT NOT NULL,
  sku VARCHAR(64) UNIQUE NOT NULL,
  price_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_reservations (
  reservation_id BIGINT PRIMARY KEY,
  variant_id BIGINT NOT NULL,
  order_id BIGINT,
  quantity INT NOT NULL,
  status VARCHAR(20) NOT NULL, -- RESERVED | CONFIRMED | RELEASED
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);

CREATE TABLE orders (
  order_id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL, -- PENDING | CONFIRMED | CANCELLED | FULFILLED
  subtotal_cents BIGINT NOT NULL,
  tax_cents BIGINT NOT NULL,
  shipping_cents BIGINT NOT NULL,
  total_cents BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
  order_item_id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  variant_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price_cents BIGINT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);

CREATE TABLE payments (
  payment_id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  provider VARCHAR(30) NOT NULL,
  provider_ref VARCHAR(255) UNIQUE,
  amount_cents BIGINT NOT NULL,
  currency CHAR(3) NOT NULL,
  status VARCHAR(20) NOT NULL, -- INITIATED | AUTHORIZED | CAPTURED | FAILED | REFUNDED
  idempotency_key VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);
```

## 3) Important indexes

```sql
CREATE INDEX idx_orders_user_created ON orders(user_id, created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_reservation_variant_status ON inventory_reservations(variant_id, status);
CREATE INDEX idx_payments_order_status ON payments(order_id, status);
```

## 4) Key modelling decisions

- Keep **price snapshot** in `order_items.unit_price_cents` to preserve historical correctness.
- Treat inventory as **reservation workflow** instead of direct decrement.
- Use `idempotency_key` for payment retries.
