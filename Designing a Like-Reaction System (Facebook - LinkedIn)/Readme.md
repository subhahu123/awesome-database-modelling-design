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
