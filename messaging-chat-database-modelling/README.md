# Messaging / Chat Application Database Modelling

## 1) Core entities

- `users`
- `conversations`
- `conversation_participants`
- `messages`
- `message_receipts`
- `message_reactions`

## 2) Reference schema

```sql
CREATE TABLE conversations (
  conversation_id BIGINT PRIMARY KEY,
  type VARCHAR(20) NOT NULL, -- DIRECT | GROUP
  title VARCHAR(255),
  created_by BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversation_participants (
  conversation_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_read_message_id BIGINT,
  PRIMARY KEY (conversation_id, user_id)
);

CREATE TABLE messages (
  message_id BIGINT PRIMARY KEY,
  conversation_id BIGINT NOT NULL,
  sender_id BIGINT NOT NULL,
  message_type VARCHAR(20) NOT NULL, -- TEXT | IMAGE | FILE | SYSTEM
  body TEXT,
  reply_to_message_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id)
);

CREATE TABLE message_receipts (
  message_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  PRIMARY KEY (message_id, user_id),
  FOREIGN KEY (message_id) REFERENCES messages(message_id)
);
```

## 3) Query-driven indexes

```sql
CREATE INDEX idx_messages_conversation_created
  ON messages(conversation_id, created_at DESC);

CREATE INDEX idx_messages_sender_created
  ON messages(sender_id, created_at DESC);
```

## 4) Scale notes

- For very large conversations, shard by `conversation_id`.
- Keep hot-path timeline reads append-friendly (`created_at DESC` index).
- Use soft deletes (`deleted_at`) to support moderation and audit.
