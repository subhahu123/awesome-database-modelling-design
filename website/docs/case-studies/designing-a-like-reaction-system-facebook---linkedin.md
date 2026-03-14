---
title: "Designing A Like Reaction System (Facebook   Linkedin)"
slug: /case-studies/designing-a-like-reaction-system-facebook---linkedin
---

> Source: `Designing a Like-Reaction System (Facebook - LinkedIn)/Readme.md`

### 🧱 Tables

### **Reaction (Source of Truth)**

```sql
CREATE TABLE Reaction (
    user_id BIGINT NOT NULL,
    entity_id BIGINT NOT NULL,
    entity_type VARCHAR(20) NOT NULL,
    reaction_type VARCHAR(20) NOT NULL,
    created_at DATETIME,
    PRIMARY KEY (user_id, entity_id, entity_type)
);
```

### **ReactionCounter (Fast Reads)**

```sql
CREATE TABLE ReactionCounter (
    entity_id BIGINT NOT NULL,
    entity_type VARCHAR(20) NOT NULL,
    reaction_type VARCHAR(20) NOT NULL,
    count BIGINT NOT NULL,
    PRIMARY KEY (entity_id, entity_type, reaction_type)
);
```

### 🧱 Tables

### **Reaction (Same as baseline)**

```sql
CREATE TABLE Reaction (
    user_id BIGINT,
    entity_id BIGINT,
    entity_type VARCHAR(20),
    reaction_type VARCHAR(20),
    updated_at DATETIME,
    PRIMARY KEY (user_id, entity_id, entity_type)
);
```

### **ReactionEvents (Optional / Kafka-backed)**

```sql
CREATE TABLE ReactionEvent (
    event_id BIGINT PRIMARY KEY,
    user_id BIGINT,
    entity_id BIGINT,
    entity_type VARCHAR(20),
    old_reaction VARCHAR(20),
    new_reaction VARCHAR(20),
    created_at DATETIME
);
```

### **ReactionCounter (Eventually Updated)**

```sql
CREATE TABLE ReactionCounter (
    entity_id BIGINT,
    entity_type VARCHAR(20),
    reaction_type VARCHAR(20),
    count BIGINT,
    PRIMARY KEY (entity_id, entity_type, reaction_type)
);
```

### 🧱 Tables

### **ReactionLog (Append Only)**

```sql
CREATE TABLE ReactionLog (
    event_id BIGINT PRIMARY KEY,
    user_id BIGINT,
    entity_id BIGINT,
    entity_type VARCHAR(20),
    reaction_type VARCHAR(20),
    created_at DATETIME
);
```

### **ReactionSnapshot (Compacted View)**

```sql
CREATE TABLE ReactionSnapshot (
    user_id BIGINT,
    entity_id BIGINT,
    entity_type VARCHAR(20),
    reaction_type VARCHAR(20),
    PRIMARY KEY (user_id, entity_id, entity_type)
);
```

### **ReactionCounter**

```sql
CREATE TABLE ReactionCounter (
    entity_id BIGINT,
    entity_type VARCHAR(20),
    reaction_type VARCHAR(20),
    count BIGINT,
    PRIMARY KEY (entity_id, entity_type, reaction_type)
);
```

### 🧱 Tables

### **Reaction**

```sql
CREATE TABLE Reaction (
    user_id BIGINT,
    entity_id BIGINT,
    reaction_type VARCHAR(20),
    PRIMARY KEY (user_id, entity_id)
);
```

### **FeedReactionSnapshot**

```sql
CREATE TABLE FeedReactionSnapshot (
    entity_id BIGINT PRIMARY KEY,
    like_count BIGINT,
    love_count BIGINT,
    laugh_count BIGINT
);
```

### 🧱 Tables

```sql
CREATE TABLE Reaction (
    user_id BIGINT,
    entity_id BIGINT,
    reaction_type VARCHAR(20)
);
```

### **Materialized View**

```sql
CREATE MATERIALIZED VIEW ReactionCounts AS
SELECT entity_id, reaction_type, COUNT(*) AS count
FROM Reaction
GROUP BY entity_id, reaction_type;
```

### **Reaction (Local Truth)**

```sql
CREATE TABLE Reaction (
    user_id BIGINT,
    entity_id BIGINT,
    reaction_type VARCHAR(20),
    region VARCHAR(20)
);
```

### **ReactionCounterCRDT**

```sql
CREATE TABLE ReactionCounterCRDT (
    entity_id BIGINT,
    reaction_type VARCHAR(20),
    region VARCHAR(20),
    count BIGINT,
    PRIMARY KEY (entity_id, reaction_type, region)
);
```


## Visual table schema (auto-generated)

### `Reaction`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `user_id` | `BIGINT` | NO | `` | `PK` |
| `entity_id` | `BIGINT` | NO | `` | `PK` |
| `entity_type` | `VARCHAR(20)` | NO | `` | `PK` |
| `reaction_type` | `VARCHAR(20)` | NO | `` | `` |
| `created_at` | `DATETIME` | YES | `` | `` |

### `ReactionCounter`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `entity_id` | `BIGINT` | NO | `` | `PK` |
| `entity_type` | `VARCHAR(20)` | NO | `` | `PK` |
| `reaction_type` | `VARCHAR(20)` | NO | `` | `PK` |
| `count` | `BIGINT` | NO | `` | `` |

### `Reaction`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `user_id` | `BIGINT` | YES | `` | `PK` |
| `entity_id` | `BIGINT` | YES | `` | `PK` |
| `entity_type` | `VARCHAR(20)` | YES | `` | `PK` |
| `reaction_type` | `VARCHAR(20)` | YES | `` | `` |
| `updated_at` | `DATETIME` | YES | `` | `` |

### `ReactionEvent`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `event_id` | `BIGINT` | NO | `` | `PK` |
| `user_id` | `BIGINT` | YES | `` | `` |
| `entity_id` | `BIGINT` | YES | `` | `` |
| `entity_type` | `VARCHAR(20)` | YES | `` | `` |
| `old_reaction` | `VARCHAR(20)` | YES | `` | `` |
| `new_reaction` | `VARCHAR(20)` | YES | `` | `` |
| `created_at` | `DATETIME` | YES | `` | `` |

### `ReactionCounter`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `entity_id` | `BIGINT` | YES | `` | `PK` |
| `entity_type` | `VARCHAR(20)` | YES | `` | `PK` |
| `reaction_type` | `VARCHAR(20)` | YES | `` | `PK` |
| `count` | `BIGINT` | YES | `` | `` |

### `ReactionLog`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `event_id` | `BIGINT` | NO | `` | `PK` |
| `user_id` | `BIGINT` | YES | `` | `` |
| `entity_id` | `BIGINT` | YES | `` | `` |
| `entity_type` | `VARCHAR(20)` | YES | `` | `` |
| `reaction_type` | `VARCHAR(20)` | YES | `` | `` |
| `created_at` | `DATETIME` | YES | `` | `` |

### `ReactionSnapshot`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `user_id` | `BIGINT` | YES | `` | `PK` |
| `entity_id` | `BIGINT` | YES | `` | `PK` |
| `entity_type` | `VARCHAR(20)` | YES | `` | `PK` |
| `reaction_type` | `VARCHAR(20)` | YES | `` | `` |

### `ReactionCounter`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `entity_id` | `BIGINT` | YES | `` | `PK` |
| `entity_type` | `VARCHAR(20)` | YES | `` | `PK` |
| `reaction_type` | `VARCHAR(20)` | YES | `` | `PK` |
| `count` | `BIGINT` | YES | `` | `` |

### `Reaction`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `user_id` | `BIGINT` | YES | `` | `PK` |
| `entity_id` | `BIGINT` | YES | `` | `PK` |
| `reaction_type` | `VARCHAR(20)` | YES | `` | `` |

### `FeedReactionSnapshot`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `entity_id` | `BIGINT` | NO | `` | `PK` |
| `like_count` | `BIGINT` | YES | `` | `` |
| `love_count` | `BIGINT` | YES | `` | `` |
| `laugh_count` | `BIGINT` | YES | `` | `` |

### `Reaction`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `user_id` | `BIGINT` | YES | `` | `` |
| `entity_id` | `BIGINT` | YES | `` | `` |
| `reaction_type` | `VARCHAR(20)` | YES | `` | `` |

### `Reaction`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `user_id` | `BIGINT` | YES | `` | `` |
| `entity_id` | `BIGINT` | YES | `` | `` |
| `reaction_type` | `VARCHAR(20)` | YES | `` | `` |
| `region` | `VARCHAR(20)` | YES | `` | `` |

### `ReactionCounterCRDT`

| Column | Type | Nullable | Default | Key |
|---|---|---|---|---|
| `entity_id` | `BIGINT` | YES | `` | `PK` |
| `reaction_type` | `VARCHAR(20)` | YES | `` | `PK` |
| `region` | `VARCHAR(20)` | YES | `` | `PK` |
| `count` | `BIGINT` | YES | `` | `` |
