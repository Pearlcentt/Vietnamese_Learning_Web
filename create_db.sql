CREATE SCHEMA `vietnamese_web`;

USE `vietnamese_web`;

CREATE TABLE `User` (
  `u_id`          INT            NOT NULL AUTO_INCREMENT,
  `username`      VARCHAR(50)    NOT NULL UNIQUE,
  `email`         VARCHAR(100)   NOT NULL UNIQUE,
  `password`      VARCHAR(255)   NOT NULL,
  `name`          VARCHAR(100)   NOT NULL,
  `dob`           DATE           NOT NULL,
  `gender`        ENUM('Male','Female','Other') NOT NULL,
  `date_created`  TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`u_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Topic` (
  `topic_id`      INT            NOT NULL AUTO_INCREMENT,
  `topic_name`    VARCHAR(255)   NOT NULL UNIQUE,
  `description`   TEXT,
  PRIMARY KEY (`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Sentence` (
  `s_id`          INT            NOT NULL AUTO_INCREMENT,
  `eng`           TEXT           NOT NULL,
  `viet`          TEXT           NOT NULL,
  `topic_name`    VARCHAR(255)   NOT NULL,
  PRIMARY KEY (`s_id`),
  INDEX (`topic_name`),
  CONSTRAINT `fk_sentence_topic`
    FOREIGN KEY (`topic_name`)
    REFERENCES `Topic` (`topic_name`)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Lesson` (
  `lesson_id`     INT            NOT NULL,
  `topic_id`      INT            NOT NULL,
  `lesson_type`   ENUM(
                    'Vocab',
                    'Fill_in_the_blank',
                    'Re_order_words',
                    'Re_order_chars',
                    'Listen_and_fill'
                  ) NOT NULL,
  PRIMARY KEY (`topic_id`, `lesson_id`),
  CONSTRAINT `fk_lesson_topic`
    FOREIGN KEY (`topic_id`)
    REFERENCES `Topic` (`topic_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Progress` (
  `u_id`         INT            NOT NULL,
  `topic_id`     INT            NOT NULL,
  `lesson_id`    INT            NOT NULL,
  `score`        INT,
  `status`       ENUM('Not Started','In Progress','Completed') NOT NULL DEFAULT 'Not Started',
  `last_updated` TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`u_id`,`topic_id`,`lesson_id`),
  INDEX (`u_id`),
  INDEX (`topic_id`),
  INDEX (`lesson_id`),
  CONSTRAINT `fk_progress_user`
    FOREIGN KEY (`u_id`)
    REFERENCES `User` (`u_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_progress_lesson`
    FOREIGN KEY (`topic_id`, `lesson_id`)
	REFERENCES `Lesson` (`topic_id`, `lesson_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `Word` (
  `w_id`               INT            NOT NULL AUTO_INCREMENT,
  `s_id`               INT            NOT NULL,
  `idx`                INT            NOT NULL,
  `viet`               VARCHAR(255)   NOT NULL,
  `viet_similar_words` TEXT,
  `eng`                VARCHAR(255)   NOT NULL,
  `eng_similar_words`  TEXT,
  PRIMARY KEY (`w_id`),
  UNIQUE KEY `uk_word_sentence_idx` (`s_id`, `idx`),
  INDEX (`s_id`),
  CONSTRAINT `fk_word_sentence`
    FOREIGN KEY (`s_id`)
    REFERENCES `Sentence` (`s_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `Lesson_Sentence` (
  `topic_id`  INT NOT NULL,
  `lesson_id` INT NOT NULL,
  `s_id`      INT NOT NULL,
  PRIMARY KEY (`topic_id`, `lesson_id`, `s_id`),
  CONSTRAINT `fk_lesson_sentence_lesson`
    FOREIGN KEY (`topic_id`, `lesson_id`)
    REFERENCES `Lesson` (`topic_id`, `lesson_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_lesson_sentence_sentence`
    FOREIGN KEY (`s_id`)
    REFERENCES `Sentence` (`s_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

