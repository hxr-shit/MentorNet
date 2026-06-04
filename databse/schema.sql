CREATE DATABASE mentornet;
USE mentornet;


USE mentornet;

SELECT * 
FROM user;

SELECT community_id, name, description
FROM community;

SELECT p.post_id, p.title, u.name
FROM post p
JOIN user u 
ON p.user_id = u.user_id;

SELECT c.comment_id, c.content, u.name
FROM comment c
JOIN user u 
ON c.user_id = u.user_id
WHERE c.post_id = 1;

SELECT p.title, c.name AS community_name
FROM post p
JOIN community c
ON p.community_id = c.community_id;

SELECT user_id, COUNT(*) AS total_posts
FROM post
GROUP BY user_id;

SELECT post_id, COUNT(*) AS total_comments
FROM comment
GROUP BY post_id;

SELECT s.svc_id, s.svc_type, s.fee, u.name
FROM counsellingp_svc s
JOIN user u
ON s.user_id = u.user_id;

SELECT svc_id, svc_type, fee
FROM counsellingp_svc
WHERE fee > 500;

SELECT session_id, scheduled_time, duration
FROM counselling_sess
WHERE status = 'Scheduled';

SELECT cs.session_id, cs.scheduled_time, s.svc_type
FROM counselling_sess cs
JOIN counsellingp_svc s
ON cs.svc_id = s.svc_id;

SELECT session_id, AVG(rating) AS avg_rating
FROM feedback
GROUP BY session_id;

SELECT user_id, name
FROM user
WHERE user_id NOT IN
(
SELECT user_id
FROM post
);

SELECT community_id, COUNT(*) AS total_posts
FROM post
GROUP BY community_id
ORDER BY total_posts DESC
LIMIT 1;


CREATE TABLE User (
user_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(150) NOT NULL UNIQUE,
user_type ENUM('student','counselor','moderator') NOT NULL,
verification_status BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Role (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE User_Role (
    user_id INT,
    role_id INT,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES Role(role_id) ON DELETE CASCADE
);

CREATE TABLE Community (
    community_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE Comment (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INT,
    post_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (post_id) REFERENCES Post(post_id)
);

CREATE TABLE Counselling_Svc (
    svc_id INT PRIMARY KEY AUTO_INCREMENT,
    svc_type VARCHAR(100),
    fee DECIMAL(8,2),
    availability VARCHAR(50),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);


CREATE TABLE Counselling_Sess (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    scheduled_time DATETIME,
    duration INT,
    mode VARCHAR(50),
    status VARCHAR(30),
    svc_id INT,
    FOREIGN KEY (svc_id) REFERENCES Counselling_Svc(svc_id)
);


CREATE TABLE Feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(255),
    user_id INT,
    session_id INT,
    FOREIGN KEY (user_id) REFERENCES `User`(user_id),
    FOREIGN KEY (session_id) REFERENCES Counselling_Sess(session_id),
    UNIQUE(user_id, session_id)
);


CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_post_user ON Post(user_id);
CREATE INDEX idx_post_community ON Post(community_id);
CREATE INDEX idx_comment_post ON Comment(post_id);
CREATE INDEX idx_session_time ON Counselling_Sess(scheduled_time);




SELECT community_id, name, description
FROM community;

select * from counselling_svc;

SELECT p.post_id, p.title, u.name
FROM post p
JOIN user u 
ON p.user_id = u.user_id;

SELECT c.comment_id, c.content, u.name
FROM comment c
JOIN user u 
ON c.user_id = u.user_id
WHERE c.post_id = 1;

SELECT p.title, c.name AS community_name
FROM post p
JOIN community c
ON p.community_id = c.community_id;

SELECT user_id, COUNT(*) AS total_posts
FROM post
GROUP BY user_id;

SELECT post_id, COUNT(*) AS total_comments
FROM comment
GROUP BY post_id;

SELECT s.svc_id, s.svc_type, s.fee, u.name
FROM counselling_svc s
JOIN user u
ON s.user_id = u.user_id;

SELECT svc_id, svc_type, fee
FROM counselling_svc
WHERE fee > 500;

SELECT cs.session_id, cs.scheduled_time, s.svc_type
FROM counselling_sess cs
JOIN counselling_svc s
ON cs.svc_id = s.svc_id;

SELECT session_id, AVG(rating) AS avg_rating
FROM feedback
GROUP BY session_id;

SELECT user_id, name
FROM user
WHERE user_id NOT IN
(
SELECT user_id
FROM post
);


SELECT community_id, COUNT(*) AS total_posts
FROM post
GROUP BY community_id
ORDER BY total_posts DESC

SELECT p.title, COUNT(c.comment_id) AS comment_count
FROM post p
LEFT JOIN comment c
ON p.post_id = c.post_id
GROUP BY p.post_id;

