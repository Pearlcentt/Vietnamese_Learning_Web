-- Add avatar and friend functionality to User table and create user_friends table
USE `vietnamese_web`;

-- Add avatar column to User table
ALTER TABLE User ADD COLUMN avatar VARCHAR(500) DEFAULT '/images/default_avatar.png';

-- Update existing users to have default avatar
# UPDATE User SET avatar = '/images/avatar3.png' WHERE avatar IS NULL;
UPDATE User SET avatar = '/images/avatar3.png' WHERE avatar = '/images/default_avatar.png';

-- Create user_friends table for storing friend relationships
CREATE TABLE `user_friends` (
  `user_id`   INT NOT NULL,
  `friend_id` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`user_id`, `friend_id`),
  INDEX (`user_id`),
  CONSTRAINT `fk_user_friends_user`
    FOREIGN KEY (`user_id`)
    REFERENCES `User` (`u_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Note: friend_id is stored as VARCHAR to match the List<String> friendIds field in the User entity
-- This allows for flexible friend ID storage as strings as specified in the requirements
