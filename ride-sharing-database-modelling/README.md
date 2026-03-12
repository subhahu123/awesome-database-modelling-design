# Ride Sharing (Uber/Ola style) Database Modelling

## 1) Core entities

- `riders`, `drivers`, `vehicles`
- `rides`
- `driver_location_events`
- `ride_state_transitions`
- `payments`

## 2) Reference schema

```sql
CREATE TABLE rides (
  ride_id BIGINT PRIMARY KEY,
  rider_id BIGINT NOT NULL,
  driver_id BIGINT,
  vehicle_id BIGINT,
  status VARCHAR(30) NOT NULL, -- REQUESTED, ACCEPTED, ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED
  pickup_lat DECIMAL(9,6) NOT NULL,
  pickup_lng DECIMAL(9,6) NOT NULL,
  drop_lat DECIMAL(9,6) NOT NULL,
  drop_lng DECIMAL(9,6) NOT NULL,
  requested_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_fare_cents BIGINT,
  final_fare_cents BIGINT
);

CREATE TABLE ride_state_transitions (
  id BIGINT PRIMARY KEY,
  ride_id BIGINT NOT NULL,
  from_state VARCHAR(30),
  to_state VARCHAR(30) NOT NULL,
  actor_type VARCHAR(20) NOT NULL, -- SYSTEM | DRIVER | RIDER
  actor_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ride_id) REFERENCES rides(ride_id)
);

CREATE TABLE driver_location_events (
  event_id BIGINT PRIMARY KEY,
  driver_id BIGINT NOT NULL,
  lat DECIMAL(9,6) NOT NULL,
  lng DECIMAL(9,6) NOT NULL,
  heading SMALLINT,
  speed_kmph SMALLINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

## 3) Key indexes

```sql
CREATE INDEX idx_rides_rider_requested ON rides(rider_id, requested_at DESC);
CREATE INDEX idx_rides_driver_status ON rides(driver_id, status);
CREATE INDEX idx_driver_location_driver_time ON driver_location_events(driver_id, created_at DESC);
```

## 4) Modelling notes

- Keep immutable state history in `ride_state_transitions` for disputes/support.
- Store latest driver location in cache; retain DB events for replay/analytics.
- Handle fare as estimate vs final to model surge and wait-time adjustments.
