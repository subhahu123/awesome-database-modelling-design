-- Insert into Users Table
INSERT INTO Users (username, email, password_hash) VALUES
('alice', 'alice@example.com', 'hashed_password_1'),
('bob', 'bob@example.com', 'hashed_password_2'),
('charlie', 'charlie@example.com', 'hashed_password_3');

-- Insert into Calendars Table
INSERT INTO Calendars (user_id, name, description, timezone) VALUES
(1, 'Work', 'Work-related events', 'UTC'),
(1, 'Personal', 'Personal events', 'UTC'),
(2, 'Fitness', 'Fitness schedule', 'UTC'),
(3, 'Travel', 'Travel plans', 'UTC');

-- Insert into Events Table
INSERT INTO Events (calendar_id, title, description, start_time, end_time, location, is_recurring, recurrence_rule) VALUES
(1, 'Team Meeting', 'Monthly team meeting', '2024-05-25 10:00:00', '2024-05-25 11:00:00', 'Conference Room', TRUE, 'RRULE:FREQ=MONTHLY;BYDAY=FR'),
(1, 'Project Deadline', 'Deadline for project X', '2024-06-01 17:00:00', '2024-06-01 17:00:00', 'Office', FALSE, NULL),
(2, 'Dentist Appointment', 'Annual check-up', '2024-05-20 15:00:00', '2024-05-20 16:00:00', 'Dental Clinic', FALSE, NULL),
(3, 'Gym Session', 'Morning workout', '2024-05-18 07:00:00', '2024-05-18 08:00:00', 'Local Gym', TRUE, 'RRULE:FREQ=WEEKLY;BYDAY=MO,WE,FR');

-- Insert into Invitations Table
INSERT INTO Invitations (event_id, invitee_id, status) VALUES
(1, 2, 'accepted'),
(1, 3, 'pending'),
(2, 3, 'declined');

-- Insert into Reminders Table
INSERT INTO Reminders (event_id, remind_at, method) VALUES
(1, '2024-05-25 09:00:00', 'email'),
(2, '2024-05-20 14:00:00', 'sms'),
(3, '2024-05-18 06:30:00', 'notification');

-- Insert into Permissions Table
INSERT INTO Permissions (calendar_id, user_id, access_level) VALUES
(1, 2, 'read'),
(1, 3, 'write'),
(2, 1, 'read'),
(3, 2, 'write');
