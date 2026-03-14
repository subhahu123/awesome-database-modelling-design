# Food Delivery (Swiggy/Zomato/UberEats style) Database Modelling

## 1) Problem statement

Design a schema for a food-delivery platform that supports:

- restaurant onboarding and menu management
- cart + checkout + payment state transitions
- real-time delivery lifecycle and rider assignment
- refunds, cancellations, and order analytics

## 2) Core entities

- `customers`
- `restaurants`
- `restaurant_menu_items`
- `delivery_partners`
- `orders`
- `order_items`
- `order_status_history`
- `payments`
- `deliveries`

## 3) Reference schema

```sql
CREATE TABLE customers (
  customer_id BIGINT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurants (
  restaurant_id BIGINT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(80) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | INACTIVE
  opened_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restaurant_menu_items (
  menu_item_id BIGINT PRIMARY KEY,
  restaurant_id BIGINT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  is_veg BOOLEAN NOT NULL,
  list_price_cents BIGINT NOT NULL CHECK (list_price_cents >= 0),
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);


CREATE TABLE delivery_partners (
  partner_id BIGINT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  vehicle_type VARCHAR(30) NOT NULL, -- BIKE | SCOOTER | CAR
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  order_id BIGINT PRIMARY KEY,
  customer_id BIGINT NOT NULL,
  restaurant_id BIGINT NOT NULL,
  order_status VARCHAR(30) NOT NULL, -- PLACED | PREPARING | PICKED_UP | DELIVERED | CANCELLED
  subtotal_cents BIGINT NOT NULL CHECK (subtotal_cents >= 0),
  delivery_fee_cents BIGINT NOT NULL DEFAULT 0 CHECK (delivery_fee_cents >= 0),
  total_cents BIGINT NOT NULL CHECK (total_cents >= 0),
  placed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  delivered_at TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(restaurant_id)
);

CREATE TABLE order_items (
  order_item_id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  menu_item_id BIGINT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price_cents BIGINT NOT NULL CHECK (unit_price_cents >= 0),
  line_total_cents BIGINT NOT NULL CHECK (line_total_cents >= 0),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (menu_item_id) REFERENCES restaurant_menu_items(menu_item_id)
);

CREATE TABLE order_status_history (
  order_id BIGINT NOT NULL,
  sequence_no INT NOT NULL,
  status VARCHAR(30) NOT NULL,
  changed_by VARCHAR(30) NOT NULL, -- SYSTEM | CUSTOMER | RESTAURANT | DELIVERY_PARTNER
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (order_id, sequence_no),
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE payments (
  payment_id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL UNIQUE,
  provider VARCHAR(30) NOT NULL,
  provider_ref VARCHAR(80),
  amount_cents BIGINT NOT NULL CHECK (amount_cents >= 0),
  status VARCHAR(20) NOT NULL, -- INITIATED | AUTHORIZED | CAPTURED | FAILED | REFUNDED
  idempotency_key VARCHAR(80) UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE deliveries (
  delivery_id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL UNIQUE,
  partner_id BIGINT,
  pickup_eta TIMESTAMP,
  drop_eta TIMESTAMP,
  picked_up_at TIMESTAMP,
  dropped_at TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (partner_id) REFERENCES delivery_partners(partner_id)
);
```

## 4) Query-driven indexes

```sql
CREATE INDEX idx_orders_customer_placed
  ON orders(customer_id, placed_at DESC);

CREATE INDEX idx_orders_restaurant_status
  ON orders(restaurant_id, order_status, placed_at DESC);

CREATE INDEX idx_order_status_history_changed
  ON order_status_history(order_id, changed_at DESC);

CREATE INDEX idx_payments_status_created
  ON payments(status, created_at DESC);
```

## 5) Read/write patterns

- **Order timeline API:** `orders` + `order_status_history` for state machine progression.
- **Restaurant dashboard:** filter by `(restaurant_id, order_status)` for active queues.
- **Customer history:** paginate by `(customer_id, placed_at DESC)`.
- **Payment retries:** enforce idempotency with `idempotency_key` to prevent double charge.

## 6) Scaling and consistency notes

- Keep order status changes append-only in `order_status_history` for auditability.
- Store payment state separately from order state so failed captures don't corrupt order data.
- Consider geo-partitioning `orders` by city/region at large scale.
- Use outbox events (`order_created`, `order_picked_up`, `order_delivered`) for async notifications.
