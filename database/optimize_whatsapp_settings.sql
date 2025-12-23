-- Optimize WhatsApp settings table for faster queries
-- Add index on id column if not exists
ALTER TABLE whatsapp_settings ADD INDEX IF NOT EXISTS idx_id (id);

-- Ensure only one row exists (should be id=1)
DELETE FROM whatsapp_settings WHERE id > 1;
