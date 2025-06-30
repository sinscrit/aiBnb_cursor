-- Initial Database Schema for QR Code-Based Instructional System
-- Migration: 001_initial_schema.sql
-- Created: June 30, 2025
-- Description: Complete database schema for MVP1 Sprint including users, properties, items, QR codes, and media assets

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Demo User)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  address VARCHAR,
  property_type VARCHAR CHECK (property_type IN ('apartment', 'house', 'condo', 'studio', 'other')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_properties_user_id ON properties(user_id);
CREATE INDEX idx_properties_type ON properties(property_type);

-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  location VARCHAR,
  media_url VARCHAR,
  media_type VARCHAR CHECK (media_type IN ('image', 'video', 'youtube', 'document', 'other')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_items_property_id ON items(property_id);
CREATE INDEX idx_items_location ON items(location);

-- QR Codes table
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  qr_id VARCHAR UNIQUE NOT NULL,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
  scan_count INTEGER DEFAULT 0,
  last_scanned TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_qr_codes_item_id ON qr_codes(item_id);
CREATE INDEX idx_qr_codes_qr_id ON qr_codes(qr_id);
CREATE INDEX idx_qr_codes_status ON qr_codes(status);

-- Media Assets table
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  file_name VARCHAR,
  file_type VARCHAR,
  file_url VARCHAR,
  file_size INTEGER,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'processing', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX idx_media_assets_item_id ON media_assets(item_id);
CREATE INDEX idx_media_assets_status ON media_assets(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_qr_codes_updated_at BEFORE UPDATE ON qr_codes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_assets_updated_at BEFORE UPDATE ON media_assets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies (for future implementation)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (permissive for demo mode)
CREATE POLICY "Enable all operations for authenticated users" ON users FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON properties FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON items FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON qr_codes FOR ALL USING (true);
CREATE POLICY "Enable all operations for authenticated users" ON media_assets FOR ALL USING (true);

-- Create view for property summary with item counts
CREATE VIEW property_summary AS
SELECT 
  p.id,
  p.user_id,
  p.name,
  p.description,
  p.address,
  p.property_type,
  p.created_at,
  p.updated_at,
  COUNT(i.id) as item_count,
  COUNT(qr.id) as qr_count
FROM properties p
LEFT JOIN items i ON p.id = i.property_id
LEFT JOIN qr_codes qr ON i.id = qr.item_id AND qr.status = 'active'
GROUP BY p.id, p.user_id, p.name, p.description, p.address, p.property_type, p.created_at, p.updated_at;

-- Create view for item summary with QR code information
CREATE VIEW item_summary AS
SELECT 
  i.id,
  i.property_id,
  i.name,
  i.description,
  i.location,
  i.media_url,
  i.media_type,
  i.created_at,
  i.updated_at,
  COUNT(qr.id) as qr_count,
  COUNT(ma.id) as media_count,
  MAX(qr.last_scanned) as last_scanned
FROM items i
LEFT JOIN qr_codes qr ON i.id = qr.item_id AND qr.status = 'active'
LEFT JOIN media_assets ma ON i.id = ma.item_id AND ma.status = 'active'
GROUP BY i.id, i.property_id, i.name, i.description, i.location, i.media_url, i.media_type, i.created_at, i.updated_at;

-- Insert initial property types reference data
-- (This could be moved to a separate reference data migration)
COMMENT ON COLUMN properties.property_type IS 'Property type: apartment, house, condo, studio, other';
COMMENT ON COLUMN items.media_type IS 'Media type: image, video, youtube, document, other';
COMMENT ON COLUMN qr_codes.status IS 'QR code status: active, inactive, expired';
COMMENT ON COLUMN media_assets.status IS 'Media asset status: active, inactive, processing, failed';

-- Schema validation complete
-- All tables created with:
-- ✓ UUID primary keys with auto-generation
-- ✓ Foreign key relationships with CASCADE deletes
-- ✓ Proper indexes for performance
-- ✓ Check constraints for data integrity
-- ✓ Automatic timestamp management
-- ✓ Row Level Security enabled
-- ✓ Useful views for common queries 