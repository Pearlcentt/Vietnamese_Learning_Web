-- Add friend_ids column to User table
-- This column will store comma-separated friend IDs like "39,18,45"

USE vietnamese_learning;

ALTER TABLE User 
ADD COLUMN friend_ids VARCHAR(1000) DEFAULT NULL 
COMMENT 'Comma-separated friend IDs (e.g., "39,18,45")';

-- Verify the column was added
DESCRIBE User;

-- Optional: Show sample data structure
SELECT u_id, username, friend_ids FROM User LIMIT 5;
