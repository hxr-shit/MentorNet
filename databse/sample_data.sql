INSERT INTO `User` (name,email,user_type,verification_status) VALUES
('Riya','riya@gmail.com','counselor',TRUE),
('Karan','karan@gmail.com','moderator',TRUE),
('Neha','neha@gmail.com','student',TRUE),
('Arjun','arjun@gmail.com','student',FALSE),
('Simran','simran@gmail.com','student',TRUE),
('Rahul','rahul@gmail.com','student',TRUE),
('Priya','priya@gmail.com','counselor',TRUE),
('Vikram','vikram@gmail.com','student',TRUE),
('Sneha','sneha@gmail.com','student',FALSE),
('Aditya','aditya@gmail.com','student',TRUE),
('Meera','meera@gmail.com','student',TRUE),
('Rohan','rohan@gmail.com','student',TRUE),
('Isha','isha@gmail.com','student',TRUE),
('Dev','dev@gmail.com','student',TRUE);


INSERT INTO Post (title,content,post_type,status,user_id,community_id) VALUES
('How to crack JEE?','Need strategy','Question','Active',1,1),
('Best MBA colleges?','Suggestions please','Question','Active',4,3),
('UPSC preparation tips','Books needed','Question','Active',6,4),
('Medical entrance help','NEET tips','Question','Active',7,2),
('Design portfolio tips','Help','Question','Active',9,5),
('Engineering internships','Where to apply?','Discussion','Active',10,1),
('Startup funding','How to get?','Discussion','Active',11,3),
('SSC preparation','Guide','Question','Active',12,4),
('Freelancing career','Worth it?','Discussion','Active',13,5),
('Coding roadmap','Guide me','Question','Active',14,1);

INSERT INTO Role (role_name) VALUES
('Student'),('Counselor'),('Moderator');


INSERT INTO Community (name,description) VALUES
('Engineering','All engineering careers'),
('Medical','Medical career discussions'),
('Business','MBA & startups'),
('Government Jobs','UPSC & SSC guidance'),
('Design','Creative careers');

INSERT INTO Comment (content,user_id,post_id) VALUES
('Start early prep',2,1),
('Focus on mock tests',3,1),
('I recommend IIMs',8,2),
('Read NCERT first',2,4),
('Build strong portfolio',3,5),
('Try LinkedIn',2,6),
('Angel investors help',8,7),
('Practice daily',2,8),
('Freelancing is good',3,9),
('Learn DSA',2,10);
