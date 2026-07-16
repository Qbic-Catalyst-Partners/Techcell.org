-- Add duration_unit to project and experiance_unit to job tables
ALTER TABLE project ADD COLUMN IF NOT EXISTS duration_unit VARCHAR(20);
ALTER TABLE job ADD COLUMN IF NOT EXISTS experiance_unit VARCHAR(20); 