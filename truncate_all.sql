USE vietnamese_web;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `Progress`;
TRUNCATE TABLE `Word`;
TRUNCATE TABLE `Lesson`;
TRUNCATE TABLE `Sentence`;
TRUNCATE TABLE `Topic`;
TRUNCATE TABLE `User`;
TRUNCATE TABLE `lesson_sentence`;
TRUNCATE TABLE `user_friends`;

SET FOREIGN_KEY_CHECKS = 1;

SHOW VARIABLES LIKE 'secure_file_priv';

DROP TABLE `Progress`;
DROP TABLE `Word`;
DROP TABLE `Lesson`;
DROP TABLE `Sentence`;
DROP TABLE `Topic`;
DROP TABLE `User`;
DROP TABLE `Lesson_Sentence`;
DROP TABLE `user_friends`

