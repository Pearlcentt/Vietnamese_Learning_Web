USE vietnamese_web;

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 9.3/Uploads/words.csv'
INTO TABLE Word
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(w_id, s_id, idx, viet, viet_similar_words, eng, eng_similar_words);

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 9.3/Uploads/sentences.csv'
INTO TABLE Sentence
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(s_id, eng, viet, topic_name);

