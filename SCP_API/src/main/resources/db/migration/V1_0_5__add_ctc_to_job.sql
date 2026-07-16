-- Add ctc_to column to job table
ALTER TABLE job ADD COLUMN IF NOT EXISTS ctc_to VARCHAR(20); 