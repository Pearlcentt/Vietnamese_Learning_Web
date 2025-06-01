-- Add points column to User table
ALTER TABLE User ADD COLUMN points INT DEFAULT 0;

-- Update existing users to have 0 points initially
UPDATE User SET points = 0 WHERE points IS NULL;

-- Add some sample points for demonstration (optional)
-- UPDATE User SET points = 50 WHERE username = 'testuser';
-- UPDATE User SET points = 75 WHERE username = 'admin';
