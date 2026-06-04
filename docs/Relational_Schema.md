User(
  user_id PK,
  name,
  email UNIQUE,
  user_type,
  verification_status,
  created_at
)

Role(
  role_id PK,
  role_name UNIQUE
)

User_Role(
  user_id FK → User(user_id),
  role_id FK → Role(role_id),
  PRIMARY KEY (user_id, role_id)
)

Community(
  community_id PK,
  name UNIQUE,
  description
)

User_Community(
  user_id FK → User(user_id),
  community_id FK → Community(community_id),
  PRIMARY KEY (user_id, community_id)
)

Post(
  post_id PK,
  title,
  content,
  post_type,
  created_at,
  status,
  user_id FK → User(user_id),
  community_id FK → Community(community_id)
)

Comment(
  comment_id PK,
  content,
  created_at,
  user_id FK → User(user_id),
  post_id FK → Post(post_id)
)

Counselling_Svc(
  svc_id PK,
  svc_type,
  fee,
  availability,
  user_id FK → User(user_id)
)

Counselling_Sess(
  session_id PK,
  scheduled_time,
  duration,
  mode,
  status,
  svc_id FK → Counselling_Svc(svc_id)
)

Session_Participant(
  session_id FK → Counselling_Sess(session_id),
  user_id FK → User(user_id),
  role_in_session,
  PRIMARY KEY (session_id, user_id)
)

Event(
  event_id PK,
  title,
  event_type,
  event_date,
  location_mode,
  organizer_type,
  organizer_id FK → User(user_id)
)

Event_Attendance(
  event_id FK → Event(event_id),
  user_id FK → User(user_id),
  PRIMARY KEY (event_id, user_id)
)

Report(
  report_id PK,
  reason,
  reported_at,
  status,
  user_id FK → User(user_id),
  post_id FK → Post(post_id)
)

Moderat_Act(
  action_id PK,
  action_type,
  action_time,
  remarks,
  moderator_id FK → User(user_id),
  post_id FK → Post(post_id)
)

Feedback(
  feedback_id PK,
  rating CHECK (rating BETWEEN 1 AND 5),
  comment,
  reported_at,
  user_id FK → User(user_id),
  session_id FK → Counselling_Sess(session_id),
  UNIQUE (user_id, session_id)
)
