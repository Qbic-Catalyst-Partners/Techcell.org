-- First drop the existing column
ALTER TABLE internship DROP COLUMN duration;

-- Then recreate it with proper DECIMAL definition
ALTER TABLE internship ADD COLUMN duration DECIMAL(10,2) DEFAULT NULL; 