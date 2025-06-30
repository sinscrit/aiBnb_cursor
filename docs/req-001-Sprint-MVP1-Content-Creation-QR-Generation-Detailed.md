# REQ-001: Sprint MVP1 - Content Creation & QR Generation - Detailed Implementation Guide

**Request Reference**: REQ-001 from [@docs/gen_requests.md](./gen_requests.md)  
**Overview Reference**: [@docs/req-001-Sprint-MVP1-Content-Creation-QR-Generation-Overview.md](./req-001-Sprint-MVP1-Content-Creation-QR-Generation-Overview.md)  
**Date**: June 30, 2025  
**Sprint**: MVP1 (Sprint 1 of 16)  
**Story Points**: 42 points (8 stories)  
**Architecture**: Hybrid Supabase + Node.js/Express  

---

## Important Instructions for AI Implementation Agent

### Working Directory Requirements:
- **CRITICAL**: All commands must be executed from the project root directory: `/Users/shinyqk/Documents/mastuff/proj/ai_stuff/aiBnb_cursor`
- **DO NOT** navigate to other folders or attempt to change directories
- **DO NOT** use `cd` commands unless explicitly specified
- All file paths are relative to the project root

### Current Project State:
- **Status**: Documentation-only phase (no code implementation yet)
- **Existing Files**: Only `.env` (minimal), `.cursorignore`, and `docs/` directory
- **Database**: No existing database or schema - must be created from scratch
- **Dependencies**: No `package.json` exists - must be created

### Authorization Constraints:
- Only modify files listed in "Authorized Files and Functions for Modification" section of the Overview document
- If any task requires modifying files outside this list, STOP and request permission
- All database changes must use Supabase migrations following the provided schema

---

## Phase 1: Project Infrastructure Setup (Tasks 1-15)

### 1. Initialize Node.js Backend Project Structure
**Story Points**: 1  
**Context**: Create the backend foundation using Express.js and configure Supabase integration

- [x] Create `package.json` for backend with Express.js, Supabase, and required dependencies
- [x] Create `server.js` as the main Express server entry point
- [x] Create `app.js` for Express application configuration
- [x] Set up basic folder structure: `routes/`, `controllers/`, `services/`, `dao/`, `middleware/`
- [x] Install dependencies: `express`, `cors`, `helmet`, `@supabase/supabase-js`, `qrcode`, `uuid`, `joi`
- [x] Install dev dependencies: `nodemon`, `jest`, `eslint`, `prettier`
- [x] Create `.gitignore` file for Node.js projects
- [x] Test basic server startup with `node server.js`

### 2. Initialize React/Next.js Frontend Project Structure  
**Story Points**: 1  
**Context**: Create the frontend foundation using Next.js with TypeScript support

- [x] Create frontend `package.json` with Next.js, React, and required dependencies
- [x] Initialize Next.js project structure in frontend directory
- [x] Install dependencies: `react`, `next`, `typescript`, `@types/react`, `axios`, `react-hook-form`, `react-query`
- [x] Create `next.config.js` configuration file
- [x] Create `tsconfig.json` for TypeScript configuration
- [x] Set up basic folder structure: `pages/`, `components/`, `utils/`, `hooks/`, `styles/`
- [x] Create initial `pages/_app.tsx` and `pages/index.tsx`
- [x] Test frontend startup with `npm run dev`

### 3. Configure Environment Variables and Supabase Connection
**Story Points**: 1  
**Context**: Set up secure configuration and Supabase project connection

- [x] Update `.env` file with Supabase project configuration:
  - [x] `SUPABASE_URL` - Supabase project URL
  - [x] `SUPABASE_ANON_KEY` - Supabase anonymous key  
  - [x] `SUPABASE_SERVICE_KEY` - Supabase service role key
  - [x] `NODE_ENV` - Environment setting
  - [x] `PORT` - Server port configuration
- [x] Create `.env.local` for frontend-specific variables
- [x] Create `services/SupabaseService.js` with Supabase client initialization
- [x] Test Supabase connection with simple query
- [x] Set up environment variable validation

### 4. Create Initial Database Schema
**Story Points**: 1  
**Context**: Establish the PostgreSQL database schema using Supabase migrations

- [x] Create `supabase/migrations/001_initial_schema.sql` with complete database schema:
  - [x] `users` table (uuid id, email, name, avatar_url, metadata, timestamps)
  - [x] `properties` table (uuid id, user_id FK, name, description, address, property_type, settings, timestamps)
  - [x] `items` table (uuid id, property_id FK, name, description, location, media_url, media_type, metadata, timestamps)
  - [x] `qr_codes` table (uuid id, item_id FK, qr_id UK, status, scan_count, last_scanned, timestamps)
  - [x] `media_assets` table (uuid id, item_id FK, file_name, file_type, file_url, file_size, status, timestamps)
- [x] Apply migration to Supabase project
- [x] Verify all tables were created correctly
- [x] Test basic CRUD operations on each table

### 5. Set Up Demo User System
**Story Points**: 1  
**Context**: Create hardcoded demo user to bypass authentication complexity

- [x] Create `supabase/migrations/002_demo_user_setup.sql` to insert demo user
- [x] Create `services/DemoUserService.js` with hardcoded user functions:
  - [x] `getCurrentUser()` - Return hardcoded demo user object
  - [x] `getDemoUserId()` - Return consistent demo user UUID
  - [x] `validateDemoUser()` - Validate demo user exists in database
- [x] Create `middleware/auth.js` for demo user authentication:
  - [x] Mock authentication middleware that sets demo user
  - [x] Skip actual JWT validation for MVP1
- [x] Test demo user integration with sample API call

## Phase 2: Core Backend Development (Tasks 6-25)

### 6. Implement Property Management Data Access Layer
**Story Points**: 1  
**Context**: Create database operations for property management (Story 2.1.1, 2.2.1)

- [x] Create `dao/PropertyDAO.js` with CRUD operations:
  - [x] `createProperty(userId, propertyData)` - Insert new property
  - [x] `getPropertiesByUserId(userId)` - Retrieve user's properties
  - [x] `getPropertyById(propertyId)` - Retrieve single property
  - [x] `updateProperty(propertyId, updates)` - Update property data
  - [x] `deleteProperty(propertyId)` - Soft delete property
- [x] Add input validation and error handling
- [x] Write unit tests for each DAO function
- [x] Test with demo user data

### 7. Implement Property Management Controllers
**Story Points**: 1  
**Context**: Create business logic layer for property operations

- [x] Create `controllers/PropertyController.js` with business logic:
  - [x] `createProperty(req, res)` - Handle property creation with validation
  - [x] `listProperties(req, res)` - Return formatted property list
  - [x] `getProperty(req, res)` - Return single property details
  - [x] `updateProperty(req, res)` - Handle property updates
  - [x] `deleteProperty(req, res)` - Handle property deletion
- [x] Add proper error handling and HTTP status codes
- [x] Implement validation using Joi schemas
- [x] Test each controller method with sample data

### 8. Create Property Management API Routes
**Story Points**: 1  
**Context**: Expose property management functionality via REST API

- [x] Create `routes/api/properties.js` with RESTful endpoints:
  - [x] `POST /api/properties` - Create new property
  - [x] `GET /api/properties` - List user's properties
  - [x] `GET /api/properties/:id` - Get property details
  - [x] `PUT /api/properties/:id` - Update property
  - [x] `DELETE /api/properties/:id` - Delete property
- [x] Apply authentication middleware (demo user)
- [x] Apply validation middleware
- [x] Add proper CORS configuration
- [x] Test all endpoints with Postman or curl

### 9. Implement Item Management Data Access Layer
**Story Points**: 1  
**Context**: Create database operations for item management (Story 3.1.1, 3.1.3, 3.2.3)

- [x] Create `dao/ItemDAO.js` with CRUD operations:
  - [x] `createItem(propertyId, itemData)` - Insert new item
  - [x] `getItemsByPropertyId(propertyId)` - Retrieve property's items
  - [x] `getItemById(itemId)` - Retrieve single item
  - [x] `updateItemLocation(itemId, location)` - Update item location
  - [x] `deleteItem(itemId)` - Soft delete item with QR cleanup
- [x] Add foreign key validation for properties
- [x] Implement cascade operations for item deletion
- [x] Write unit tests for each DAO function
- [x] Test with sample property data

### 9.1. **BUG FIX**: Verify Item Management Data Access Layer Implementation
**Story Points**: 0.5  
**Context**: Task 9 was incorrectly marked as failed - ItemDAO.js actually exists and is fully implemented

- [x] **Files to modify**: None (verification only)
- [x] Verify `dao/ItemDAO.js` exists (301 lines, fully implemented)
- [x] Confirm all CRUD operations are working: createItem, getItemsByPropertyId, getItemById, updateItemLocation, deleteItem
- [x] Test ItemDAO functions directly in isolation
- [x] Update task status documentation to reflect actual implementation state
- [x] **Root Cause**: ItemDAO exists but is not accessible via API due to missing Controller and Routes

### 10. Implement Item Management Controllers
**Story Points**: 1  
**Context**: Create business logic layer for item operations

- [ ] Create `controllers/ItemController.js` with business logic:
  - [ ] `createItem(req, res)` - Handle item creation with validation
  - [ ] `listItems(req, res)` - Return formatted item list for property
  - [ ] `getItem(req, res)` - Return single item details
  - [ ] `updateItemLocation(req, res)` - Handle location updates
  - [ ] `deleteItem(req, res)` - Handle item deletion with QR cleanup
- [ ] Add validation for property ownership by demo user
- [ ] Implement location validation and suggestions
- [ ] Test each controller method with sample data

### 10.1. **BUG FIX**: Create Missing Item Management Controller
**Story Points**: 1  
**Context**: ItemController.js does not exist, preventing Item API functionality

- [x] **Files to modify**: `controllers/ItemController.js` (CREATE NEW FILE)
- [x] Create `controllers/ItemController.js` following the same pattern as `PropertyController.js`
- [x] Import existing `ItemDAO` from `dao/ItemDAO.js` 
- [x] Implement controller methods that wrap DAO operations:
  - [x] `createItem(req, res)` - Validate input, call ItemDAO.createItem, return formatted response
  - [x] `listItems(req, res)` - Handle query parameters, call ItemDAO.getItemsByPropertyId
  - [x] `getItem(req, res)` - Call ItemDAO.getItemById with validation
  - [x] `updateItemLocation(req, res)` - Call ItemDAO.updateItemLocation
  - [x] `deleteItem(req, res)` - Call ItemDAO.deleteItem with confirmation
- [x] Add proper HTTP status codes (200, 201, 400, 404, 500)
- [x] Add error handling middleware integration
- [x] Use same validation pattern as PropertyController (Joi schemas)
- [x] **Root Cause**: Controller layer missing - DAO exists but no business logic layer to expose it

### 11. Create Item Management API Routes
**Story Points**: 1  
**Context**: Expose item management functionality via REST API

- [ ] Create `routes/api/items.js` with RESTful endpoints:
  - [ ] `POST /api/items` - Create new item
  - [ ] `GET /api/items?propertyId=:id` - List items for property
  - [ ] `GET /api/items/:id` - Get item details
  - [ ] `PUT /api/items/:id/location` - Update item location
  - [ ] `DELETE /api/items/:id` - Delete item
- [ ] Apply authentication and validation middleware
- [ ] Add property ownership validation
- [ ] Test all endpoints with sample data

### 11.1. **BUG FIX**: Create Missing Item API Routes and Register in App
**Story Points**: 1  
**Context**: routes/api/items.js does not exist and route is commented out in app.js

- [x] **Files to modify**: 
  - [x] `routes/api/items.js` (CREATE NEW FILE)
  - [x] `app.js` (UNCOMMENT line 39)
- [x] Create `routes/api/items.js` following the pattern of `routes/api/properties.js`:
  - [x] Import `ItemController` from `controllers/ItemController.js`
  - [x] Import authentication middleware
  - [x] Set up Express router with middleware
  - [x] Define RESTful routes matching the endpoint specification
  - [x] Export router module
- [x] Update `app.js` to register Item routes:
  - [x] Uncomment line 39: `app.use('/api/items', require('./routes/api/items'));`
  - [x] Ensure route is placed after properties route registration
- [x] Test API endpoints:
  - [x] `GET /api/items?propertyId=550e8400-e29b-41d4-a716-446655440001` should return items
  - [x] Verify 404 error is resolved
- [x] **Root Cause**: API routes file missing and not registered in Express app

### 11.2. **BUG FIX**: Debug Items API Database Connection Issue
**Story Points**: 1  
**Context**: Items API returning "Database Error: Invalid API key" despite existing ItemDAO

- [x] **Files to modify**: 
  - [x] `dao/ItemDAO.js` (FIXED - Supabase service import pattern)
  - [x] `services/SupabaseService.js` (VERIFIED)
  - [x] `.env` (VERIFIED)
- [x] **Step 1**: Debug Supabase connection in ItemDAO:
  - [x] Fixed ItemDAO import pattern to match PropertyDAO: `SupabaseService.getSupabaseClient()`
  - [x] Replaced incorrect destructured import with consistent service pattern
  - [x] Updated all DAO methods to use correct Supabase client initialization
- [x] **Step 2**: Verify environment configuration:
  - [x] Confirmed anonymous key is working (Properties API functions correctly)
  - [x] Verified same credentials work for both Properties and Items
  - [x] Environment configuration validated as correct
- [x] **Step 3**: Fix authentication middleware integration:
  - [x] ItemController already uses same auth pattern as PropertyController
  - [x] Demo user ID properly passed to ItemDAO functions
  - [x] Authentication flow working correctly
- [x] **Step 4**: Test API endpoints:
  - [x] Verified `GET /api/items?propertyId=550e8400-e29b-41d4-a716-446655440001` returns items successfully
  - [x] API returns 3 items with full property information
  - [x] Database connection working correctly
- [x] **Root Cause**: ItemDAO was using incorrect Supabase service import pattern (`getSupabaseServiceClient()` destructured import vs `SupabaseService.getSupabaseClient()` consistent pattern)

### 12. Implement QR Code Generation Service
**Story Points**: 1  
**Context**: Create QR code generation and UUID management (Story 4.1.1)

- [ ] Create `services/QRService.js` with core QR functionality:
  - [ ] `generateUniqueCode()` - Generate unique UUID for QR codes
  - [ ] `createQRCode(itemId, options)` - Generate QR code image
  - [ ] `validateQRFormat(qrData)` - Validate QR code format
  - [ ] `getQRCodeURL(qrId)` - Generate content page URL
- [ ] Configure QR code generation options (size, error correction)
- [ ] Add support for PNG format with high resolution
- [ ] Test QR code generation with various data inputs
- [ ] Validate generated QR codes can be scanned

### 13. Implement QR Code Data Access Layer
**Story Points**: 1  
**Context**: Create database operations for QR code management (Story 4.2.1)

- [ ] Create `dao/QRCodeDAO.js` with CRUD operations:
  - [ ] `createQRMapping(itemId, qrId)` - Create QR-to-item mapping
  - [ ] `getQRMappingByQRId(qrId)` - Retrieve item by QR code
  - [ ] `getQRCodesByItemId(itemId)` - Get QR codes for item
  - [ ] `updateQRStatus(qrId, status)` - Update QR code status
  - [ ] `deleteQRMapping(qrId)` - Delete QR code mapping
- [ ] Add unique constraint validation for QR IDs
- [ ] Implement status tracking (active, inactive)
- [ ] Write unit tests for each DAO function
- [ ] Test mapping integrity with sample data

### 14. Implement QR Code Management Controllers
**Story Points**: 1  
**Context**: Create business logic layer for QR code operations

- [ ] Create `controllers/QRController.js` with business logic:
  - [ ] `generateQRCode(req, res)` - Handle QR generation for item
  - [ ] `getQRMapping(req, res)` - Retrieve item data by QR code
  - [ ] `listQRCodes(req, res)` - List QR codes for item/property
  - [ ] `updateQRStatus(req, res)` - Handle QR status changes
  - [ ] `downloadQRCode(req, res)` - Serve QR code image
- [ ] Add validation for item ownership
- [ ] Implement QR code download functionality
- [ ] Test each controller method with generated QR codes

### 15. Create QR Code Management API Routes
**Story Points**: 1  
**Context**: Expose QR code functionality via REST API

- [ ] Create `routes/api/qrcodes.js` with RESTful endpoints:
  - [ ] `POST /api/qrcodes` - Generate QR code for item
  - [ ] `GET /api/qrcodes/:qrId/mapping` - Get item by QR code
  - [ ] `GET /api/qrcodes?itemId=:id` - List QR codes for item
  - [ ] `PUT /api/qrcodes/:qrId/status` - Update QR status
  - [ ] `GET /api/qrcodes/:qrId/download` - Download QR image
- [ ] Apply authentication and validation middleware
- [ ] Add proper headers for file downloads
- [ ] Test all endpoints with generated QR codes

### 15.1. **BUG FIX**: Implement Complete QR Code Management System
**Story Points**: 3  
**Context**: Entire QR code system is missing - services, DAO, controller, and routes

- [x] **Files to modify**: 
  - [x] `services/QRService.js` (CREATED - 200+ lines with QR generation, validation, utilities)
  - [x] `dao/QRCodeDAO.js` (CREATED - 534 lines with full CRUD operations)
  - [x] `controllers/QRController.js` (CREATED - 8 endpoints with business logic)
  - [x] `routes/api/qrcodes.js` (CREATED - RESTful API with auth middleware)
  - [x] `app.js` (QR routes already registered at line 40)
- [x] **Step 1**: Create `services/QRService.js`:
  - [x] Dependencies already installed: `qrcode uuid` are available
  - [x] Implemented QR code generation using `qrcode` library with base64 and buffer output
  - [x] Generate unique QR identifiers using `uuid.v4()`
  - [x] Create URL format: `http://localhost:3000/content/{qrId}`
- [x] **Step 2**: Create `dao/QRCodeDAO.js`:
  - [x] Implemented full CRUD operations matching actual database schema
  - [x] Handle QR-to-item mapping with foreign keys
  - [x] Add status tracking (active/inactive) and scan count functionality
- [x] **Step 3**: Create `controllers/QRController.js`:
  - [x] Import QRService and QRCodeDAO with proper error handling
  - [x] Implement 8 business logic endpoints: generate, list, retrieve, update, delete, download, batch, statistics
  - [x] Add comprehensive validation and error handling with proper HTTP status codes
- [x] **Step 4**: Create `routes/api/qrcodes.js` and register:
  - [x] Define 8 RESTful QR endpoints with proper documentation
  - [x] Apply authentication middleware (`authMiddleware.authenticateDemo`)
  - [x] QR routes properly registered and working in `app.js`
- [x] **Testing Results**: 
  - [x] QR Generation: Successfully created QR code for Coffee Machine item
  - [x] QR Listing: Returns 2 QR codes with statistics (total_count: 2, active: 2)
  - [x] QR Mapping: Retrieves complete item/property data, increments scan count
  - [x] QR Download: Returns PNG image with proper headers (Content-Length: 3472)
- [x] **Root Cause**: Complete QR system successfully implemented across all layers

## Phase 3: Frontend Application Development (Tasks 16-30)

### 16. Create Dashboard Layout Components
**Story Points**: 1  
**Context**: Build the main dashboard layout and navigation structure

- [ ] Create `components/Layout/DashboardLayout.js` with main layout:
  - [ ] Header with app title and demo user indicator
  - [ ] Navigation menu for properties, items, QR codes
  - [ ] Main content area with proper spacing
  - [ ] Footer with basic information
- [ ] Create `components/Common/Navigation.js` with menu items
- [ ] Create `components/Common/Button.js` reusable button component
- [ ] Add basic CSS styling for layout components
- [ ] Test responsive design on mobile and desktop

### 16.1. **BUG FIX**: Create Missing Dashboard and Navigation Pages
**Story Points**: 2  
**Context**: Landing page exists but functional dashboard and navigation pages are missing

- [x] **Files to modify**: 
  - [x] `frontend/pages/dashboard.tsx` (CREATE NEW FILE)
  - [x] `frontend/components/Layout/DashboardLayout.js` (CREATE NEW FILE)
  - [x] `frontend/components/Common/Navigation.js` (CREATE NEW FILE)
  - [x] `frontend/pages/index.tsx` (MODIFY "Get Started" button)
- [x] **Step 1**: Create `frontend/pages/dashboard.tsx`:
  - [x] Create main dashboard page with navigation to properties, items, QR codes
  - [x] Add system status indicators
  - [x] Include quick action buttons
- [x] **Step 2**: Create `frontend/components/Layout/DashboardLayout.js`:
  - [x] Build reusable layout component with header, nav, footer
  - [x] Add responsive navigation menu
  - [x] Include demo user indicator
- [x] **Step 3**: Create `frontend/components/Common/Navigation.js`:
  - [x] Add navigation links: Properties, Items, QR Codes, Dashboard
  - [x] Implement active state for current page
- [x] **Step 4**: Fix "Get Started" button in `frontend/pages/index.tsx`:
  - [x] Replace placeholder alert with actual navigation to `/dashboard`
  - [x] Add proper routing using Next.js router
- [x] **Root Cause**: Frontend structure exists but missing functional pages and navigation routing

### 17. Implement Property Registration Form
**Story Points**: 1  
**Context**: Create form for property creation (Story 2.1.1)

- [ ] Create `components/Property/PropertyForm.js` with form fields:
  - [ ] Property name (required)
  - [ ] Property description (required)  
  - [ ] Property address (optional)
  - [ ] Property type selection from predefined list
  - [ ] Form validation with error messages
- [ ] Create `pages/properties/create.js` for property creation page
- [ ] Implement form submission with API integration
- [ ] Add success/error notifications
- [ ] Test form validation and submission

### 18. Implement Property Listing Interface
**Story Points**: 1  
**Context**: Create property listing and management views (Story 2.2.1)

- [ ] Create `components/Property/PropertyList.js` with property grid:
  - [ ] Property cards showing key information
  - [ ] Quick action buttons for each property
  - [ ] Property count display
  - [ ] Sort options (name, date, status)
- [ ] Create `components/Property/PropertyCard.js` for individual property display
- [ ] Create `pages/properties/index.js` for property listing page
- [ ] Implement API integration for fetching properties
- [ ] Test with multiple sample properties

### 17.1 & 18.1. **BUG FIX**: Create Missing Property Frontend Pages and Components
**Story Points**: 3  
**Context**: Property API works but frontend pages return 404 - no property management interface

- [x] **Files to modify**: 
  - [x] `frontend/pages/properties/` (CREATE NEW DIRECTORY)
  - [x] `frontend/pages/properties/index.js` (CREATE NEW FILE)
  - [x] `frontend/pages/properties/create.js` (CREATE NEW FILE)
  - [x] `frontend/components/Property/` (CREATE NEW DIRECTORY)
  - [x] `frontend/components/Property/PropertyForm.js` (CREATE NEW FILE)
  - [x] `frontend/components/Property/PropertyList.js` (CREATE NEW FILE)
  - [x] `frontend/components/Property/PropertyCard.js` (CREATE NEW FILE)
- [x] **Step 1**: Create directory structure:
  - [x] Create `frontend/pages/properties/` directory
  - [x] Create `frontend/components/Property/` directory
- [x] **Step 2**: Create `frontend/pages/properties/index.js`:
  - [x] Property listing page using PropertyList component
  - [x] API integration with `http://localhost:3001/api/properties`
  - [x] Add "Create New Property" button linking to `/properties/create`
- [x] **Step 3**: Create `frontend/pages/properties/create.js`:
  - [x] Property creation page using PropertyForm component
  - [x] Form submission to Properties API
  - [x] Success/error handling and redirect
- [x] **Step 4**: Create Property components:
  - [x] `PropertyForm.js` - Form with validation for property creation
  - [x] `PropertyList.js` - Grid layout showing property cards
  - [x] `PropertyCard.js` - Individual property display with actions
- [x] **Step 5**: Test endpoints:
  - [x] Verify `http://localhost:3002/properties` loads property listing
  - [x] Verify `http://localhost:3002/properties/create` loads creation form
- [x] **Root Cause**: Frontend directory structure for properties missing entirely

### 19. Create Property Management Pages
**Story Points**: 1  
**Context**: Complete property management interface

- [ ] Create `pages/properties/[id]/edit.js` for property editing:
  - [ ] Load existing property data
  - [ ] Pre-populate form fields
  - [ ] Handle updates and validation
- [ ] Add property deletion functionality with confirmation
- [ ] Implement navigation between property pages
- [ ] Add loading states and error handling
- [ ] Test complete property management workflow

### 20. Implement Item Registration Form
**Story Points**: 1  
**Context**: Create form for item creation and location tracking (Story 3.1.1, 3.1.3)

- [ ] Create `components/Item/ItemForm.js` with form fields:
  - [ ] Item name (required)
  - [ ] Item description (required)
  - [ ] Location assignment with suggestions
  - [ ] Property selection dropdown
  - [ ] Form validation with error messages
- [ ] Create `pages/items/create.js` for item creation page
- [ ] Implement location suggestions based on item type
- [ ] Add form submission with API integration
- [ ] Test form validation and location tracking

### 20.1. **BUG FIX**: Create Missing Item Frontend Pages and Components
**Story Points**: 3  
**Context**: Item backend exists but frontend pages return 404 - no item management interface

- [ ] **Files to modify**: 
  - [ ] `frontend/pages/items/` (CREATE NEW DIRECTORY)
  - [ ] `frontend/pages/items/index.js` (CREATE NEW FILE)
  - [ ] `frontend/pages/items/create.js` (CREATE NEW FILE)
  - [ ] `frontend/components/Item/` (CREATE NEW DIRECTORY)
  - [ ] `frontend/components/Item/ItemForm.js` (CREATE NEW FILE)
  - [ ] `frontend/components/Item/ItemList.js` (CREATE NEW FILE)
  - [ ] `frontend/components/Item/ItemCard.js` (CREATE NEW FILE)
- [ ] **Step 1**: Create directory structure:
  - [ ] Create `frontend/pages/items/` directory
  - [ ] Create `frontend/components/Item/` directory
- [ ] **Step 2**: Create `frontend/pages/items/index.js`:
  - [ ] Item listing page using ItemList component
  - [ ] API integration with Item API (once bug fix 11.1 is completed)
  - [ ] Add "Create New Item" button linking to `/items/create`
  - [ ] Add property filter dropdown
- [ ] **Step 3**: Create `frontend/pages/items/create.js`:
  - [ ] Item creation page using ItemForm component
  - [ ] Property selection dropdown populated from Properties API
  - [ ] Location suggestions based on item type
  - [ ] Form submission to Items API
- [ ] **Step 4**: Create Item components:
  - [ ] `ItemForm.js` - Form with validation for item creation and location tracking
  - [ ] `ItemList.js` - Grid layout showing item cards with property and location info
  - [ ] `ItemCard.js` - Individual item display with QR generation button
- [ ] **Step 5**: Test endpoints:
  - [ ] Verify `http://localhost:3002/items` loads item listing
  - [ ] Verify `http://localhost:3002/items/create` loads creation form
- [ ] **Dependencies**: Requires completion of bug fix tasks 10.1 and 11.1 (Item Controller and API routes)
- [ ] **Root Cause**: Frontend directory structure for items missing entirely

### 21. Implement Item Listing Interface  
**Story Points**: 1  
**Context**: Create item listing and management views

- [ ] Create `components/Item/ItemList.js` with item grid:
  - [ ] Item cards showing name, location, property
  - [ ] Quick action buttons for QR generation
  - [ ] Filter by property and location
  - [ ] Item count display
- [ ] Create `components/Item/ItemCard.js` for individual item display
- [ ] Create `pages/items/index.js` for item listing page
- [ ] Implement API integration for fetching items
- [ ] Test with multiple sample items across properties

### 22. Create Item Management Pages
**Story Points**: 1  
**Context**: Complete item management interface including deletion (Story 3.2.3)

- [ ] Create `pages/items/[id]/edit.js` for item editing:
  - [ ] Load existing item data
  - [ ] Pre-populate form fields including location
  - [ ] Handle location updates
- [ ] Add item deletion functionality with confirmation:
  - [ ] Warning about QR code deactivation
  - [ ] Cleanup confirmation
- [ ] Implement navigation between item pages
- [ ] Test complete item management workflow including deletion

### 23. Implement QR Code Generation Interface
**Story Points**: 1  
**Context**: Create QR code generation and display components (Story 4.1.1)

- [ ] Create `components/QR/QRGenerator.js` with generation controls:
  - [ ] Generate button for individual items
  - [ ] QR code generation progress indicator
  - [ ] Success/error feedback
- [ ] Create `components/QR/QRDisplay.js` with QR code display:
  - [ ] QR code image display
  - [ ] Download button for high-resolution PNG
  - [ ] QR code status indicator
- [ ] Integrate QR generation with item management
- [ ] Test QR code generation for multiple items

### 24. Create QR Code Management Pages
**Story Points**: 1  
**Context**: Complete QR code management interface (Story 4.2.1)

- [ ] Create `pages/qr/[itemId].js` for QR code management:
  - [ ] Display existing QR codes for item
  - [ ] Generate new QR codes
  - [ ] Download QR code images
  - [ ] QR code status management
- [ ] Add QR code listing within property/item views
- [ ] Implement QR code download functionality
- [ ] Test complete QR workflow from generation to download

### 24.1. **BUG FIX**: Create Missing QR Code Frontend Pages
**Story Points**: 2  
**Context**: QR Codes pages return 404 - no QR code management interface exists

- [ ] **Files to modify**: 
  - [ ] `frontend/pages/qrcodes/` (CREATE NEW DIRECTORY)
  - [ ] `frontend/pages/qrcodes/index.js` (CREATE NEW FILE)
  - [ ] `frontend/pages/qrcodes/[itemId].js` (CREATE NEW FILE)
  - [ ] `frontend/components/QR/` (CREATE NEW DIRECTORY)
  - [ ] `frontend/components/QR/QRGenerator.js` (CREATE NEW FILE)
  - [ ] `frontend/components/QR/QRDisplay.js` (CREATE NEW FILE)
  - [ ] `frontend/components/QR/QRList.js` (CREATE NEW FILE)
- [ ] **Step 1**: Create directory structure:
  - [ ] Create `frontend/pages/qrcodes/` directory
  - [ ] Create `frontend/components/QR/` directory
- [ ] **Step 2**: Create `frontend/pages/qrcodes/index.js`:
  - [ ] QR code listing page for all items
  - [ ] Filter by property and item
  - [ ] Add "Generate QR Code" functionality
- [ ] **Step 3**: Create `frontend/pages/qrcodes/[itemId].js`:
  - [ ] Item-specific QR code management page
  - [ ] Display existing QR codes for specific item
  - [ ] Generate new QR codes for item
  - [ ] Download QR code functionality
- [ ] **Step 4**: Create QR components:
  - [ ] `QRGenerator.js` - QR code generation interface with progress indicators
  - [ ] `QRDisplay.js` - QR code image display with download buttons
  - [ ] `QRList.js` - List of QR codes with status and actions
- [ ] **Step 5**: Test QR code pages:
  - [ ] Verify `http://localhost:3002/qrcodes` loads QR listing
  - [ ] Verify `http://localhost:3002/qrcodes/[itemId]` loads item QR management
- [ ] **Dependencies**: Requires completion of bug fix task 15.1 (QR Code Management System)
- [ ] **Root Cause**: Frontend QR pages completely missing - no routes or components exist

### 25. Create API Client and Utilities
**Story Points**: 1  
**Context**: Set up frontend API communication and utilities

- [ ] Create `utils/api.js` with Axios configuration:
  - [ ] Base URL configuration
  - [ ] Request/response interceptors
  - [ ] Error handling utilities
  - [ ] Demo user authentication headers
- [ ] Create `utils/constants.js` with application constants
- [ ] Create `utils/helpers.js` with utility functions
- [ ] Create `utils/validators.js` with form validation
- [ ] Test API client with all backend endpoints

### 25.1. **BUG FIX**: Fix Frontend-Backend API Connectivity Issues
**Story Points**: 2  
**Context**: All frontend pages show "Failed to fetch" errors - cannot connect to backend APIs

- [ ] **Files to modify**: 
  - [ ] `frontend/utils/api.js` (CREATE NEW FILE)
  - [ ] `frontend/utils/constants.js` (CREATE NEW FILE)
  - [ ] `frontend/pages/properties/index.js` (MODIFY)
  - [ ] `frontend/pages/items/index.js` (MODIFY when created)
  - [ ] `frontend/next.config.js` (MODIFY)
- [ ] **Step 1**: Create centralized API client:
  - [ ] Create `frontend/utils/api.js` with Axios configuration
  - [ ] Set correct base URL: `http://localhost:8000/api` (backend port)
  - [ ] Add request interceptors for authentication headers
  - [ ] Add response interceptors for error handling
- [ ] **Step 2**: Fix CORS configuration:
  - [ ] Verify backend CORS allows frontend origin `http://localhost:3000`
  - [ ] Update `app.js` CORS configuration if needed
  - [ ] Test cross-origin requests between ports 3000 ↔ 8000
- [ ] **Step 3**: Create constants file:
  - [ ] Create `frontend/utils/constants.js` with API endpoints
  - [ ] Define backend base URL as configurable constant
  - [ ] Add environment-specific configurations
- [ ] **Step 4**: Update existing frontend pages:
  - [ ] Replace hardcoded API calls with centralized API client
  - [ ] Fix incorrect port references (3001 → 8000)
  - [ ] Add proper error handling for network failures
- [ ] **Step 5**: Test API connectivity:
  - [ ] Verify Properties API calls work from frontend
  - [ ] Test error handling for network issues
  - [ ] Confirm loading states work properly
- [ ] **Root Cause**: Frontend making API calls to wrong ports and missing centralized error handling

### 25.2. **BUG FIX**: Debug CORS and Network Configuration Issues
**Story Points**: 1  
**Context**: Network connectivity issues between frontend (port 3000) and backend (port 8000)

- [ ] **Files to modify**: 
  - [ ] `app.js` (MODIFY CORS configuration)
  - [ ] `frontend/next.config.js` (ADD proxy configuration)
  - [ ] `package.json` (VERIFY scripts)
- [ ] **Step 1**: Fix backend CORS configuration:
  - [ ] Update `app.js` to allow `http://localhost:3000` origin
  - [ ] Add proper CORS headers for credentials and methods
  - [ ] Test CORS with browser dev tools network tab
- [ ] **Step 2**: Add Next.js proxy configuration (if needed):
  - [ ] Configure `frontend/next.config.js` to proxy API calls
  - [ ] Set up rewrites for `/api/*` to `http://localhost:8000/api/*`
  - [ ] Test proxy functionality
- [ ] **Step 3**: Verify server startup configuration:
  - [ ] Confirm backend runs on port 8000 as expected
  - [ ] Confirm frontend runs on port 3000 as expected
  - [ ] Test both servers can be accessed independently
- [ ] **Step 4**: Add network debugging:
  - [ ] Add request/response logging to identify failed calls
  - [ ] Test with browser network tab to see actual errors
  - [ ] Verify authentication headers are being sent correctly
- [ ] **Step 5**: Test complete workflow:
  - [ ] Test frontend can successfully fetch from all backend endpoints
  - [ ] Verify error messages are user-friendly
  - [ ] Confirm loading states work during API calls
- [ ] **Root Cause**: CORS misconfiguration or network routing issues between frontend and backend ports

## Phase 4: Content Display System (Tasks 26-35)

### 26. Implement Dynamic Content Page Routing
**Story Points**: 1  
**Context**: Create URL routing for QR code content display (Story 6.1.1)

- [ ] Create `pages/content/[qrCode].js` for dynamic content pages:
  - [ ] Dynamic route parameter handling
  - [ ] QR code validation and lookup
  - [ ] Item data fetching by QR code
  - [ ] Error handling for invalid QR codes
- [ ] Create `controllers/ContentController.js` for content serving:
  - [ ] `renderContentPage(req, res)` - Generate dynamic content
  - [ ] QR code validation and item lookup
  - [ ] Mobile-responsive content rendering
- [ ] Create `routes/api/content.js` for content API endpoints
- [ ] Test dynamic URL generation and access

### 26.1. **BUG FIX**: Implement Complete Content Display System
**Story Points**: 3  
**Context**: Content display system is completely missing - no content pages or API endpoints

- [ ] **Files to modify**: 
  - [ ] `controllers/ContentController.js` (CREATE NEW FILE)
  - [ ] `routes/api/content.js` (CREATE NEW FILE)
  - [ ] `frontend/pages/content/` (CREATE NEW DIRECTORY)
  - [ ] `frontend/pages/content/[qrCode].js` (CREATE NEW FILE)
  - [ ] `frontend/components/Content/` (CREATE NEW DIRECTORY)
  - [ ] `frontend/components/Content/ContentPage.js` (CREATE NEW FILE)
  - [ ] `app.js` (UNCOMMENT line 41)
- [ ] **Step 1**: Create backend content system:
  - [ ] Create `controllers/ContentController.js` to handle content page requests
  - [ ] Implement QR code to item lookup logic
  - [ ] Add mobile-responsive content rendering
  - [ ] Create `routes/api/content.js` for content API endpoints
  - [ ] Uncomment line 41 in `app.js` to register content routes
- [ ] **Step 2**: Create frontend content system:
  - [ ] Create `frontend/pages/content/` directory
  - [ ] Create `frontend/pages/content/[qrCode].js` for dynamic QR content pages
  - [ ] Implement QR code parameter handling and item data fetching
  - [ ] Create `frontend/components/Content/ContentPage.js` for content display
- [ ] **Step 3**: Test content display workflow:
  - [ ] Test URLs like `http://localhost:3002/content/[qrCode]` load properly
  - [ ] Verify content is mobile-responsive
  - [ ] Test invalid QR code error handling
- [ ] **Dependencies**: Requires completion of bug fix task 15.1 (QR Code Management System)
- [ ] **Root Cause**: Complete content display system not implemented - both backend and frontend missing

### 27. Build Mobile-Responsive Content Display Templates
**Story Points**: 1  
**Context**: Create mobile-optimized content display templates

- [ ] Create `components/Content/ContentPage.js` with responsive layout:
  - [ ] Mobile-first design approach
  - [ ] Item name and description display
  - [ ] Location information display
  - [ ] Responsive image and text scaling
- [ ] Add mobile-specific styling in `styles/components.css`:
  - [ ] Touch-friendly interface elements
  - [ ] Readable text without zooming
  - [ ] Proper spacing for mobile screens
- [ ] Test on various mobile screen sizes
- [ ] Verify readability and usability

### 28. Implement Basic Media Embedding Framework
**Story Points**: 1  
**Context**: Set up foundation for media content display

- [ ] Create media embedding components:
  - [ ] Basic image display component
  - [ ] Placeholder for YouTube video embedding
  - [ ] Text content formatting
- [ ] Add media type detection logic
- [ ] Implement fallback content for missing media
- [ ] Create responsive media containers
- [ ] Test with sample media content

### 29. Set Up Error Handling for Content Pages
**Story Points**: 1  
**Context**: Handle invalid QR codes and missing content gracefully

- [ ] Create error page components:
  - [ ] Invalid QR code error page
  - [ ] Content not found error page
  - [ ] General error fallback page
- [ ] Implement proper HTTP status codes (404, 400, 500)
- [ ] Add user-friendly error messages
- [ ] Include troubleshooting suggestions
- [ ] Test error scenarios with invalid QR codes

### 30. Integrate Content Display with QR System
**Story Points**: 1  
**Context**: Complete the QR-to-content workflow

- [ ] Test complete workflow: Generate QR → Access URL → Display content
- [ ] Verify QR code URL format matches content routing
- [ ] Test content page loading performance (under 3 seconds)
- [ ] Validate mobile responsiveness of generated pages
- [ ] Confirm item information displays correctly
- [ ] Test with multiple QR codes and items

## Phase 5: Integration & Testing (Tasks 31-42)

### 31. Integrate Backend Services
**Story Points**: 1  
**Context**: Ensure all backend services work together seamlessly

- [ ] Test property → item → QR code creation workflow
- [ ] Verify data integrity across all operations
- [ ] Test cascade operations (property deletion affects items)
- [ ] Validate foreign key relationships
- [ ] Test error propagation between services
- [ ] Verify demo user isolation works correctly

### 32. Integrate Frontend with Backend APIs
**Story Points**: 1  
**Context**: Connect frontend components with backend services

- [ ] Test all frontend forms submit to correct API endpoints
- [ ] Verify API responses are handled correctly
- [ ] Test error handling and user feedback
- [ ] Validate loading states work properly
- [ ] Test navigation between pages works
- [ ] Verify data updates reflect immediately

### 33. Test Complete Property Management Workflow
**Story Points**: 1  
**Context**: Validate end-to-end property operations (Stories 2.1.1, 2.2.1)

- [ ] Test property creation from frontend form
- [ ] Verify property appears in listing immediately
- [ ] Test property editing and updates
- [ ] Verify property deletion (with items) works correctly
- [ ] Test property listing sorting and filtering
- [ ] Validate all acceptance criteria are met

### 34. Test Complete Item Management Workflow
**Story Points**: 1  
**Context**: Validate end-to-end item operations (Stories 3.1.1, 3.1.3, 3.2.3)

- [ ] Test item creation with location assignment
- [ ] Verify items appear in property listings
- [ ] Test item location updates
- [ ] Test item deletion with QR code cleanup
- [ ] Verify item-property relationships
- [ ] Validate all acceptance criteria are met

### 35. Test Complete QR Code Workflow
**Story Points**: 1  
**Context**: Validate end-to-end QR operations (Stories 4.1.1, 4.2.1)

- [ ] Test QR code generation for items
- [ ] Verify QR codes link to correct content pages
- [ ] Test QR code download functionality
- [ ] Verify QR-to-item mapping accuracy
- [ ] Test QR code status management
- [ ] Validate all acceptance criteria are met

### 36. Test Content Display Workflow
**Story Points**: 1  
**Context**: Validate end-to-end content display (Story 6.1.1)

- [ ] Test content page generation from QR codes
- [ ] Verify mobile responsiveness of content pages
- [ ] Test error handling for invalid QR codes
- [ ] Verify content loads within 3 seconds
- [ ] Test item information display accuracy
- [ ] Validate all acceptance criteria are met

### 37. Perform Cross-Browser Testing
**Story Points**: 1  
**Context**: Ensure compatibility across different browsers

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Verify mobile browser compatibility
- [ ] Test QR code scanning functionality
- [ ] Verify responsive design consistency
- [ ] Test API functionality across browsers
- [ ] Document any browser-specific issues

### 38. Test Mobile Responsiveness
**Story Points**: 1  
**Context**: Validate mobile user experience

- [ ] Test on various mobile screen sizes (320px to 768px)
- [ ] Verify touch interactions work properly
- [ ] Test content readability without zooming
- [ ] Verify navigation is thumb-friendly
- [ ] Test QR code display on mobile devices
- [ ] Validate loading performance on mobile

### 39. Validate Data Integrity and Relationships
**Story Points**: 1  
**Context**: Ensure database consistency and relationship integrity

- [ ] Test foreign key constraints work correctly
- [ ] Verify cascade deletions work as expected
- [ ] Test data validation at database level
- [ ] Verify unique constraints (QR codes, emails)
- [ ] Test transaction rollbacks on errors
- [ ] Validate data consistency across operations

### 40. Test Error Handling Scenarios
**Story Points**: 1  
**Context**: Ensure robust error handling throughout the system

- [ ] Test API errors are handled gracefully
- [ ] Test network connectivity issues
- [ ] Test invalid data submission scenarios
- [ ] Test database connection errors
- [ ] Test file upload error scenarios
- [ ] Verify user feedback for all error types

### 41. Perform End-to-End Integration Testing
**Story Points**: 1  
**Context**: Test complete user journeys from start to finish

- [ ] Test complete workflow: Property → Items → QR → Content
- [ ] Test multiple properties with multiple items
- [ ] Test QR code generation and content access
- [ ] Test deletion workflows with proper cleanup
- [ ] Verify demo user isolation works correctly
- [ ] Test concurrent operations handle properly

### 42. Final Validation and Documentation
**Story Points**: 1  
**Context**: Ensure MVP1 is complete and ready for demo

- [ ] Verify all 8 user stories are completely implemented
- [ ] Test all acceptance criteria are met
- [ ] Verify performance requirements (3-second load times)
- [ ] Test the complete value flow: Create → Generate → View
- [ ] Document any known limitations or issues
- [ ] Prepare demo data for presentation
- [ ] Confirm readiness for Sprint MVP2

---

## Testing Requirements

### Unit Testing Tasks (Included in above tasks):
- Test all DAO functions with sample data
- Test all controller methods with mock requests
- Test all service functions with various inputs
- Test all utility functions and validators

### Integration Testing Tasks (Included in above tasks):
- Test API endpoints with Postman/curl
- Test frontend-backend integration
- Test database operations and relationships
- Test QR code generation and validation

### End-to-End Testing Tasks (Included in above tasks):
- Test complete user workflows
- Test error scenarios and edge cases
- Test mobile responsiveness and cross-browser compatibility
- Test performance requirements

---

## Success Criteria Validation

### Story 2.1.1 - Property Registration (5 points):
- [ ] Host can create property with name and description ✓
- [ ] Property address is optional but recommended ✓
- [ ] Property type can be selected from predefined list ✓
- [ ] Property is immediately available for item assignment ✓
- [ ] Host can create multiple properties ✓

### Story 2.2.1 - Property Listing (3 points):
- [ ] All user properties are displayed in a list ✓
- [ ] Property cards show key information ✓
- [ ] List can be sorted by name, date, or status ✓
- [ ] Quick actions are available for each property ✓
- [ ] Property count is displayed ✓

### Story 3.1.1 - Item Registration (5 points):
- [ ] Items can be added to any property ✓
- [ ] Item name and description are required ✓
- [ ] Item location within property can be specified ✓
- [ ] Multiple items can be added quickly ✓
- [ ] Items are immediately available for QR generation ✓

### Story 3.1.3 - Item Location Tracking (3 points):
- [ ] Location can be room or specific area ✓
- [ ] Location suggestions based on item type ✓
- [ ] Location is displayed to guests ✓
- [ ] Items can be moved between locations ✓
- [ ] Location-based filtering is available ✓

### Story 3.2.3 - Item Deletion (5 points):
- [ ] Items can be deleted with confirmation ✓
- [ ] Associated QR codes are deactivated ✓
- [ ] Media files are marked for cleanup ✓
- [ ] Deletion is logged for audit purposes ✓
- [ ] Soft delete preserves data for recovery ✓

### Story 4.1.1 - Individual QR Code Generation (8 points):
- [ ] Each QR code has unique UUID identifier ✓
- [ ] QR codes link to item-specific content pages ✓
- [ ] Generated codes are immediately functional ✓
- [ ] QR codes include error correction ✓
- [ ] Generation process is under 3 seconds ✓

### Story 4.2.1 - QR Code to Item Mapping (5 points):
- [ ] Each QR code maps to exactly one item ✓
- [ ] Mappings are maintained in database ✓
- [ ] Mapping changes are logged ✓
- [ ] Orphaned QR codes are identified ✓
- [ ] Mapping integrity is verified regularly ✓

### Story 6.1.1 - Dynamic Content Page Generation (8 points):
- [ ] Pages are generated dynamically from QR scans ✓
- [ ] Content loads within 3 seconds ✓
- [ ] Pages work without user registration ✓
- [ ] Content is formatted appropriately for mobile ✓
- [ ] Pages include item name and description ✓

---

## Technical Specifications

### Database Schema (From Architecture Document):
```sql
-- Users table (Demo User)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  avatar_url VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Properties table
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR NOT NULL,
  description TEXT,
  address VARCHAR,
  property_type VARCHAR,
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Items table
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id),
  name VARCHAR NOT NULL,
  description TEXT,
  location VARCHAR,
  media_url VARCHAR,
  media_type VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- QR Codes table
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id),
  qr_id VARCHAR UNIQUE NOT NULL,
  status VARCHAR DEFAULT 'active',
  scan_count INTEGER DEFAULT 0,
  last_scanned TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Media Assets table
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id),
  file_name VARCHAR,
  file_type VARCHAR,
  file_url VARCHAR,
  file_size INTEGER,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Required Dependencies:
**Backend:**
- express ^4.18.0
- cors ^2.8.5
- helmet ^6.1.0
- @supabase/supabase-js ^2.26.0
- qrcode ^1.5.3
- uuid ^9.0.0
- joi ^17.9.0

**Frontend:**
- react ^18.2.0
- next ^13.4.0
- typescript ^5.1.0
- @types/react ^18.2.0
- axios ^1.4.0
- react-hook-form ^7.45.0
- react-query ^3.39.0

---

---

## BUG FIX TASKS SUMMARY

**Total Original Tasks**: 42 (1 story point each)  
**Total Bug Fix Tasks Added**: 13 (23.5 story points total)  
**Combined Total Tasks**: 55  
**Bug Fix Story Points**: 23.5  
**Revised Total Story Points**: 65.5  

### Bug Fix Tasks Added:

1. **Task 9.1**: Verify Item Management Data Access Layer Implementation (0.5 points)
   - **Status**: Verification only - ItemDAO already exists
   - **Files**: None (verification)

2. **Task 10.1**: Create Missing Item Management Controller (1 point)
   - **Status**: Controller layer missing
   - **Files**: `controllers/ItemController.js`

3. **Task 11.1**: Create Missing Item API Routes and Register in App (1 point)
   - **Status**: API routes missing and commented out
   - **Files**: `routes/api/items.js`, `app.js`

4. **Task 11.2**: Debug Items API Database Connection Issue (1 point)
   - **Status**: Database connection errors preventing Items API functionality
   - **Files**: `controllers/ItemController.js`, `services/SupabaseService.js`, `.env`

5. **Task 15.1**: Implement Complete QR Code Management System (3 points)
   - **Status**: Entire QR system missing
   - **Files**: `services/QRService.js`, `dao/QRCodeDAO.js`, `controllers/QRController.js`, `routes/api/qrcodes.js`, `app.js`

6. **Task 16.1**: Create Missing Dashboard and Navigation Pages (2 points)
   - **Status**: Landing page exists but functional pages missing
   - **Files**: `frontend/pages/dashboard.tsx`, `frontend/components/Layout/DashboardLayout.js`, `frontend/components/Common/Navigation.js`, `frontend/pages/index.tsx`

7. **Task 17.1 & 18.1**: Create Missing Property Frontend Pages and Components (3 points)
   - **Status**: Property API works but frontend pages missing
   - **Files**: `frontend/pages/properties/`, `frontend/components/Property/`

8. **Task 20.1**: Create Missing Item Frontend Pages and Components (3 points)
   - **Status**: Item backend exists but frontend pages missing
   - **Files**: `frontend/pages/items/`, `frontend/components/Item/`

9. **Task 24.1**: Create Missing QR Code Frontend Pages (2 points)
   - **Status**: QR Codes pages return 404 - no QR management interface
   - **Files**: `frontend/pages/qrcodes/`, `frontend/components/QR/`

10. **Task 25.1**: Fix Frontend-Backend API Connectivity Issues (2 points)
    - **Status**: All frontend pages show "Failed to fetch" errors
    - **Files**: `frontend/utils/api.js`, `frontend/utils/constants.js`, `frontend/pages/properties/index.js`, `frontend/next.config.js`

11. **Task 25.2**: Debug CORS and Network Configuration Issues (1 point)
    - **Status**: Network connectivity issues between frontend and backend ports
    - **Files**: `app.js`, `frontend/next.config.js`, `package.json`

12. **Task 26.1**: Implement Complete Content Display System (3 points)
    - **Status**: Content display system completely missing
    - **Files**: `controllers/ContentController.js`, `routes/api/content.js`, `frontend/pages/content/`, `frontend/components/Content/`, `app.js`

### Implementation Priority:
1. **🔥 Critical Backend Foundation** (Tasks 10.1, 11.1, 11.2) - 3 points
2. **🔥 Frontend-Backend Connectivity** (Tasks 25.1, 25.2) - 3 points  
3. **🔥 QR System Backend** (Task 15.1) - 3 points
4. **🔥 Frontend Infrastructure** (Task 16.1) - 2 points
5. **📋 Property Frontend** (Tasks 17.1 & 18.1) - 3 points
6. **📋 Item Frontend** (Task 20.1) - 3 points
7. **📋 QR Frontend** (Task 24.1) - 2 points
8. **📋 Content System** (Task 26.1) - 3 points

---

**Document Version**: 1.2  
**Total Tasks**: 55 (Original: 42 + Bug Fixes: 13)  
**Total Story Points**: 65.5 (Original: 42 + Bug Fixes: 23.5)  
**Estimated Completion**: 7 days (revised for connectivity issues)  
**Reference**: [@docs/gen_requests.md](./gen_requests.md) - REQ-001  
**Overview Reference**: [@docs/req-001-Sprint-MVP1-Content-Creation-QR-Generation-Overview.md](./req-001-Sprint-MVP1-Content-Creation-QR-Generation-Overview.md)  
**Last Updated**: December 19, 2024 (Additional Bug Fix Tasks Added for Connectivity Issues)

---

## Additional Bug Fix Tasks Added Based on Validation Log Analysis

**Date Added**: December 19, 2024  
**Source**: [@docs/req-001-Sprint-MVP1-Content-Creation-QR-Generation-log.md](./req-001-Sprint-MVP1-Content-Creation-QR-Generation-log.md) Priority TODO List  

### New Critical Issues Addressed:
1. **Items API Database Connection** - "Database Error: Invalid API key" preventing Items system functionality
2. **Frontend-Backend Connectivity** - "Failed to fetch" errors across all frontend pages  
3. **CORS Configuration** - Network issues between ports 3000 ↔ 8000
4. **Missing QR Frontend** - QR Codes pages returning 404 errors
5. **API Client Architecture** - No centralized error handling or configuration

### Impact on Project Timeline:
- **Original Estimate**: 5 days (56.5 story points)
- **Revised Estimate**: 7 days (65.5 story points)  
- **Critical Path**: Frontend-backend connectivity must be resolved before most other features can be tested
- **Priority Order**: Backend Foundation → Connectivity → QR System → Frontend Pages → Content System 