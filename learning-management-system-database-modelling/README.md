# Learning Management System (LMS) Database Modelling

## 1) Problem statement

Model an LMS similar to Coursera/Udemy internal platform with support for:

- multi-instructor course authoring
- module/lesson hierarchy and versioning
- enrollments, progress tracking, and completion certificates
- quizzes with attempts and graded submissions

## 2) Core entities

- `users`
- `courses`
- `course_instructors`
- `course_modules`
- `lessons`
- `enrollments`
- `lesson_progress`
- `quizzes`
- `quiz_questions`
- `quiz_attempts`

## 3) Reference schema

```sql
CREATE TABLE users (
  user_id BIGINT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) NOT NULL, -- STUDENT | INSTRUCTOR | ADMIN
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  course_id BIGINT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  level VARCHAR(20), -- BEGINNER | INTERMEDIATE | ADVANCED
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- DRAFT | PUBLISHED | ARCHIVED
  published_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_instructors (
  course_id BIGINT NOT NULL,
  instructor_id BIGINT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (course_id, instructor_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  FOREIGN KEY (instructor_id) REFERENCES users(user_id)
);

CREATE TABLE course_modules (
  module_id BIGINT PRIMARY KEY,
  course_id BIGINT NOT NULL,
  module_title VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL,
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  UNIQUE (course_id, sort_order)
);

CREATE TABLE lessons (
  lesson_id BIGINT PRIMARY KEY,
  module_id BIGINT NOT NULL,
  lesson_title VARCHAR(255) NOT NULL,
  lesson_type VARCHAR(20) NOT NULL, -- VIDEO | ARTICLE | ASSIGNMENT
  duration_seconds INT,
  sort_order INT NOT NULL,
  FOREIGN KEY (module_id) REFERENCES course_modules(module_id),
  UNIQUE (module_id, sort_order)
);

CREATE TABLE enrollments (
  enrollment_id BIGINT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  course_id BIGINT NOT NULL,
  enrolled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  completion_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | COMPLETED | DROPPED
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (course_id) REFERENCES courses(course_id),
  UNIQUE (user_id, course_id)
);

CREATE TABLE lesson_progress (
  user_id BIGINT NOT NULL,
  lesson_id BIGINT NOT NULL,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  watch_seconds INT NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
);

CREATE TABLE quizzes (
  quiz_id BIGINT PRIMARY KEY,
  lesson_id BIGINT NOT NULL,
  title VARCHAR(255) NOT NULL,
  passing_score INT NOT NULL DEFAULT 60,
  max_attempts INT NOT NULL DEFAULT 3,
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
);

CREATE TABLE quiz_attempts (
  attempt_id BIGINT PRIMARY KEY,
  quiz_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  attempt_no INT NOT NULL,
  score INT,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  UNIQUE (quiz_id, user_id, attempt_no)
);
```

## 4) Query-driven indexes

```sql
CREATE INDEX idx_courses_status_published
  ON courses(status, published_at DESC);

CREATE INDEX idx_enrollments_user_status
  ON enrollments(user_id, status, enrolled_at DESC);

CREATE INDEX idx_lesson_progress_user
  ON lesson_progress(user_id, completed_at DESC);

CREATE INDEX idx_quiz_attempts_user_submitted
  ON quiz_attempts(user_id, submitted_at DESC);
```

## 5) Read/write patterns

- **Course catalog API:** list only `PUBLISHED` courses ordered by `published_at`.
- **My learning dashboard:** join `enrollments` + `courses` + derived progress from `lesson_progress`.
- **Course player:** module/lesson tree loaded by `course_id` and sorted by `sort_order`.
- **Quiz grading workflow:** append attempts, cap via `max_attempts`, and compute best/latest score.

## 6) Scaling and consistency notes

- Store progress at lesson granularity to avoid expensive full-course recomputation.
- Maintain denormalized aggregates (e.g., `completion_percent`) asynchronously for fast dashboards.
- Keep course content version metadata if edits should not affect already enrolled batches.
- Archive stale progress/attempt telemetry to cold storage for long-term analytics.
