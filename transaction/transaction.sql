SELECT u.name AS mentor_name, AVG(f.rating) AS avg_rating
FROM user u
JOIN counselling_svc s ON u.user_id = s.user_id
JOIN counselling_sess cs ON s.svc_id = cs.svc_id
JOIN feedback f ON cs.session_id = f.session_id
GROUP BY u.user_id
HAVING AVG(f.rating) > 6;

START TRANSACTION;

INSERT INTO post (title, content, post_type, status, user_id, community_id)
VALUES ('Commit', 'It will stay', 'Discussion', 'Active', 1, 1);

SELECT * FROM post ORDER BY post_id DESC;

COMMIT;

START TRANSACTION;

INSERT INTO post (title, content, post_type, status, user_id, community_id)
VALUES ('Rollback', 'It will disappear', 'Discussion', 'Active', 1, 1);

ROLLBACK;
SELECT * FROM post WHERE title = 'Rollback';


START TRANSACTION;

UPDATE counselling_svc
SET fee = 1000
WHERE svc_id = 1;	
COMMIT;
SELECT @@autocommit;

START TRANSACTION;

UPDATE counselling_svc
SET fee = 2000
WHERE svc_id = 1;

COMMIT;

SELECT session_id, scheduled_time, duration
FROM counselling_sess
  
WHERE status = 'Scheduled';

INSERT INTO `User` (name,email,user_type,verification_status) VALUES
('Ranjan','ranjan@gmail.com','student',TRUE);
