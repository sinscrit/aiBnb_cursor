-- Demo User Setup for QR Code-Based Instructional System
-- Migration: 002_demo_user_setup.sql
-- Created: June 30, 2025
-- Description: Insert hardcoded demo user for MVP1 Sprint to bypass authentication complexity

-- Insert Demo User
-- Using a fixed UUID for consistency across environments
INSERT INTO users (
  id,
  email,
  name,
  avatar_url,
  metadata,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000', -- Fixed UUID for demo user
  'demo@qrinstruct.com',
  'Demo User',
  'https://via.placeholder.com/150/007bff/ffffff?text=DU',
  '{"role": "demo", "account_type": "demo", "limitations": "MVP1 demo user with full access"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  avatar_url = EXCLUDED.avatar_url,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Insert some sample properties for the demo user to showcase functionality
INSERT INTO properties (
  id,
  user_id,
  name,
  description,
  address,
  property_type,
  settings,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440001', -- Fixed UUID for demo property 1
  '550e8400-e29b-41d4-a716-446655440000', -- Demo user ID
  'Downtown Apartment',
  'Modern 2-bedroom apartment in the heart of downtown. Perfect for business travelers.',
  '123 Main Street, Downtown, City, State 12345',
  'apartment',
  '{"check_in_time": "3:00 PM", "check_out_time": "11:00 AM", "wifi_password": "demo2024"}',
  NOW(),
  NOW()
), (
  '550e8400-e29b-41d4-a716-446655440002', -- Fixed UUID for demo property 2
  '550e8400-e29b-41d4-a716-446655440000', -- Demo user ID
  'Cozy Studio',
  'Charming studio apartment with all amenities. Great for solo travelers.',
  '456 Oak Avenue, Midtown, City, State 12345',
  'studio',
  '{"check_in_time": "4:00 PM", "check_out_time": "10:00 AM", "parking": "Street parking available"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  property_type = EXCLUDED.property_type,
  settings = EXCLUDED.settings,
  updated_at = NOW();

-- Insert sample items for the demo properties
INSERT INTO items (
  id,
  property_id,
  name,
  description,
  location,
  media_url,
  media_type,
  metadata,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440010', -- Fixed UUID for demo item 1
  '550e8400-e29b-41d4-a716-446655440001', -- Downtown Apartment
  'Coffee Machine',
  'How to use the Nespresso coffee machine. Includes how to make different types of coffee and where to find pods.',
  'Kitchen Counter',
  'https://www.youtube.com/watch?v=demo-coffee-machine',
  'youtube',
  '{"difficulty": "easy", "duration": "2 minutes", "category": "kitchen"}',
  NOW(),
  NOW()
), (
  '550e8400-e29b-41d4-a716-446655440011', -- Fixed UUID for demo item 2
  '550e8400-e29b-41d4-a716-446655440001', -- Downtown Apartment
  'TV & Entertainment System',
  'Complete guide to using the smart TV, sound system, and streaming services. Includes Netflix, Hulu, and cable TV instructions.',
  'Living Room',
  'https://www.youtube.com/watch?v=demo-tv-system',
  'youtube',
  '{"difficulty": "medium", "duration": "5 minutes", "category": "entertainment"}',
  NOW(),
  NOW()
), (
  '550e8400-e29b-41d4-a716-446655440012', -- Fixed UUID for demo item 3
  '550e8400-e29b-41d4-a716-446655440001', -- Downtown Apartment
  'Washer & Dryer',
  'Step-by-step instructions for using the in-unit washer and dryer. Includes proper detergent usage and cycle selection.',
  'Laundry Closet',
  'https://www.youtube.com/watch?v=demo-laundry',
  'youtube',
  '{"difficulty": "easy", "duration": "3 minutes", "category": "appliances"}',
  NOW(),
  NOW()
), (
  '550e8400-e29b-41d4-a716-446655440013', -- Fixed UUID for demo item 4
  '550e8400-e29b-41d4-a716-446655440002', -- Cozy Studio
  'Kitchenette Appliances',
  'Guide to using the mini-fridge, microwave, and hot plate in the studio kitchenette.',
  'Kitchenette',
  'https://www.youtube.com/watch?v=demo-kitchenette',
  'youtube',
  '{"difficulty": "easy", "duration": "3 minutes", "category": "kitchen"}',
  NOW(),
  NOW()
), (
  '550e8400-e29b-41d4-a716-446655440014', -- Fixed UUID for demo item 5
  '550e8400-e29b-41d4-a716-446655440002', -- Cozy Studio
  'Murphy Bed',
  'How to safely operate the Murphy bed. Includes setup for sleeping and converting back to seating area.',
  'Main Room',
  'https://www.youtube.com/watch?v=demo-murphy-bed',
  'youtube',
  '{"difficulty": "medium", "duration": "4 minutes", "category": "furniture"}',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  location = EXCLUDED.location,
  media_url = EXCLUDED.media_url,
  media_type = EXCLUDED.media_type,
  metadata = EXCLUDED.metadata,
  updated_at = NOW();

-- Insert sample QR codes for the demo items
INSERT INTO qr_codes (
  id,
  item_id,
  qr_id,
  status,
  scan_count,
  last_scanned,
  created_at,
  updated_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440020', -- Fixed UUID for demo QR 1
  '550e8400-e29b-41d4-a716-446655440010', -- Coffee Machine
  'DEMO-COFFEE-001',
  'active',
  0,
  NULL,
  NOW(),
  NOW()
), (
  '550e8400-e29b-41d4-a716-446655440021', -- Fixed UUID for demo QR 2
  '550e8400-e29b-41d4-a716-446655440011', -- TV & Entertainment
  'DEMO-TV-001',
  'active',
  0,
  NULL,
  NOW(),
  NOW()
), (
  '550e8400-e29b-41d4-a716-446655440022', -- Fixed UUID for demo QR 3
  '550e8400-e29b-41d4-a716-446655440012', -- Washer & Dryer
  'DEMO-LAUNDRY-001',
  'active',
  0,
  NULL,
  NOW(),
  NOW()
), (
  '550e8400-e29b-41d4-a716-446655440023', -- Fixed UUID for demo QR 4
  '550e8400-e29b-41d4-a716-446655440013', -- Kitchenette
  'DEMO-KITCHEN-001',
  'active',
  0,
  NULL,
  NOW(),
  NOW()
), (
  '550e8400-e29b-41d4-a716-446655440024', -- Fixed UUID for demo QR 5
  '550e8400-e29b-41d4-a716-446655440014', -- Murphy Bed
  'DEMO-BED-001',
  'active',
  0,
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (qr_id) DO UPDATE SET
  status = EXCLUDED.status,
  updated_at = NOW();

-- Verification queries to ensure demo data is properly inserted
-- These are comments for reference, not executable in migration

-- SELECT * FROM users WHERE email = 'demo@qrinstruct.com';
-- SELECT * FROM properties WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
-- SELECT * FROM items WHERE property_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002');
-- SELECT * FROM qr_codes WHERE item_id IN (SELECT id FROM items WHERE property_id IN ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'));

-- Demo data insertion complete
-- ✓ Demo user created with fixed UUID
-- ✓ 2 sample properties created
-- ✓ 5 sample items created with YouTube instructions
-- ✓ 5 sample QR codes created and mapped to items
-- ✓ All data uses fixed UUIDs for consistency
-- ✓ Complete demo workflow ready for testing 