-- Add secondary description field to hero_section table
ALTER TABLE hero_section 
ADD COLUMN secondaryDescription TEXT AFTER description;

-- Update existing row with default value
UPDATE hero_section 
SET secondaryDescription = 'A comprehensive documentation of how Al Rajhi Bank''s operational failures and communication breakdowns led to the collapse of a €120 million investment deal for the SHHEER mobile advertising platform.'
WHERE id = 1;
