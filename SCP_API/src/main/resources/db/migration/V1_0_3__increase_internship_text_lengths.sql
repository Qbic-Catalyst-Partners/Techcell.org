-- Increase length of text fields to accommodate up to 1000 characters
ALTER TABLE internship 
  MODIFY COLUMN company_desc VARCHAR(1000) NULL,
  MODIFY COLUMN skills VARCHAR(1000) NULL; 