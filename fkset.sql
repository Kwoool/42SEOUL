
--설치해야 할 파일들
--npm i body-parser cookie-parser cors crypto dotenv express express-session mysql mysql2 nunjucks path router sequelize sequelize-cli
 

--application, interview, review에 foreign key 부여
ALTER TABLE application
ADD CONSTRAINT curr_app_id
FOREIGN KEY (curr_id)
REFERENCES curriculum(id); 	

ALTER TABLE interview
ADD CONSTRAINT curr_int_id
FOREIGN KEY (curr_id)
REFERENCES curriculum(id); 	

ALTER TABLE review
ADD CONSTRAINT curr_rev_id
FOREIGN KEY (curr_id)
REFERENCES curriculum(id); 	

alter table curriculum drop foreign key curr_app_id;
alter table interview drop foreign key curr_int_id;
alter table review drop foreign key curr_rev_id;




--user에서:
-- SELECT * FROM user 
-- AS A LEFT JOIN (select username, userclass from curriculum) AS B ON A.curr_id=B.id;


select id, title, userid, content, date_format(date, '%Y-%m-%d %h:%i:%s') as date, hit, curr_id, `show` from review order by id desc limit 3