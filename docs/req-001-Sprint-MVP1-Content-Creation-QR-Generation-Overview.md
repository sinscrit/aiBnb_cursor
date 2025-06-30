# REQ-001: Sprint MVP1 - Content Creation & QR Generation - Implementation Overview

**Request Reference**: REQ-001 from [@docs/gen_requests.md](./gen_requests.md)  
**Date**: June 30, 2025  
**Sprint**: MVP1 (Sprint 1 of 16)  
**Story Points**: 42 points (8 stories)  
**Architecture**: Hybrid Supabase + Node.js/Express  

---

## 1. Goals Restatement

As defined in **REQ-001**, this implementation establishes the foundational content creation and QR code generation workflow using a hardcoded "Demo User" approach to prove the core value proposition without authentication complexity.

### Primary Objectives:
1. **Content Creation Foundation**: Enable property registration, item management, and location tracking
2. **QR Code Generation System**: Create unique QR codes tied to items with proper mapping
3. **Content Display Capability**: Generate dynamic content pages accessible via direct URL
4. **End-to-End Value Proof**: Demonstrate complete workflow from creation to viewing

### Expected Value Flow:
```
Create property → Add locations → Add items → Generate QR codes → View content page (via direct URL)
```

### Success Criteria:
- Complete implementation of 8 Sprint MVP1 user stories
- Functional demo without authentication complexity
- Foundation for Sprint MVP2 (QR scanning and mobile experience)
- Production-ready architecture pattern established

---

## 2. Implementation Breakdown & Execution Order

### Phase 1: Project Infrastructure Setup (Day 1)
**Priority**: Foundation - Must complete before development begins

1. **Project Initialization**
   - Initialize Node.js/Express backend project structure
   - Set up React/Next.js frontend project
   - Configure Supabase project and environment variables
   - Install and configure core dependencies

2. **Database Schema Setup**
   - Create Supabase PostgreSQL database schema
   - Set up tables: properties, items, locations, qr_codes, media_assets
   - Configure relationships and constraints
   - Create initial data migration scripts

3. **Development Environment**
   - Configure development server scripts
   - Set up API routing structure
   - Configure Supabase client connections
   - Establish build and deployment pipelines

### Phase 2: Core Backend Development (Day 1-2)
**Priority**: High - Backend foundation for all features

4. **Property Management System** (Stories 2.1.1, 2.2.1)
   - Implement property registration endpoints
   - Create property listing and filtering logic
   - Set up hardcoded "Demo User" system
   - Implement property CRUD operations

5. **Item Management System** (Stories 3.1.1, 3.1.3, 3.2.3)
   - Create item registration and tracking endpoints
   - Implement location assignment system
   - Build item deletion with proper cleanup
   - Establish item-property relationships

6. **QR Code Generation Service** (Stories 4.1.1, 4.2.1)
   - Implement QR code generation logic
   - Create item-to-QR mapping system
   - Set up unique UUID generation for QR codes
   - Build QR code management endpoints

### Phase 3: Frontend Application Development (Day 2-3)
**Priority**: High - User interface for content creation

7. **Property Management Interface**
   - Create property registration forms
   - Build property listing and management views
   - Implement property details and editing interfaces
   - Add property status indicators

8. **Item Management Interface**
   - Design item registration and editing forms
   - Create location assignment interfaces
   - Build item listing and deletion controls
   - Implement item-property association views

9. **QR Code Management Interface**
   - Create QR code generation triggers
   - Design QR code display and download features
   - Build QR code status management views
   - Implement batch operations interface

### Phase 4: Content Display System (Day 3)
**Priority**: Medium - Completes value loop

10. **Dynamic Content Pages** (Story 6.1.1)
    - Create dynamic URL routing for items
    - Build mobile-responsive content display templates
    - Implement media embedding framework
    - Set up error handling for invalid URLs

### Phase 5: Integration & Testing (Day 3)
**Priority**: Essential - Ensures reliability

11. **End-to-End Integration**
    - Connect all backend services
    - Integrate frontend with API endpoints
    - Test complete workflow functionality
    - Validate QR code generation and mapping

12. **Quality Assurance**
    - Test all CRUD operations
    - Verify data integrity and relationships
    - Validate error handling scenarios
    - Confirm mobile responsiveness

---

## 3. Authorized Files and Functions for Modification

### 3.1 Project Structure Files

**Root Level:**
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Dependency lock file
- `.env` - Environment variables configuration
- `.env.local` - Local development environment
- `.gitignore` - Git ignore patterns
- `README.md` - Project documentation

**Configuration Files:**
- `next.config.js` - Next.js configuration
- `supabase/config.toml` - Supabase project configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Tailwind CSS configuration (if used)

### 3.2 Backend API Files

**Core Server:**
- `server.js` or `index.js` - Main Express server entry point
- `app.js` - Express application configuration

**API Routes:**
- `routes/api/properties.js` - Property management endpoints
- `routes/api/items.js` - Item management endpoints  
- `routes/api/qrcodes.js` - QR code generation and management
- `routes/api/content.js` - Content page serving endpoints

**Controllers:**
- `controllers/PropertyController.js` - Property business logic
- `controllers/ItemController.js` - Item management logic
- `controllers/QRController.js` - QR code generation logic
- `controllers/ContentController.js` - Content page generation

**Services:**
- `services/QRService.js` - QR code generation and validation
- `services/SupabaseService.js` - Database connection and operations
- `services/ValidationService.js` - Input validation logic
- `services/DemoUserService.js` - Hardcoded user implementation

**Data Access Objects:**
- `dao/PropertyDAO.js` - Property database operations
- `dao/ItemDAO.js` - Item database operations
- `dao/QRCodeDAO.js` - QR code database operations
- `dao/LocationDAO.js` - Location database operations

**Middleware:**
- `middleware/auth.js` - Authentication middleware (Demo User)
- `middleware/validation.js` - Request validation middleware
- `middleware/errorHandler.js` - Error handling middleware
- `middleware/cors.js` - CORS configuration

### 3.3 Frontend Application Files

**Pages/Views:**
- `pages/index.js` - Dashboard home page
- `pages/properties/index.js` - Property listing page
- `pages/properties/create.js` - Property creation page
- `pages/properties/[id]/edit.js` - Property editing page
- `pages/items/index.js` - Item listing page
- `pages/items/create.js` - Item creation page
- `pages/items/[id]/edit.js` - Item editing page
- `pages/qr/[itemId].js` - QR code management page
- `pages/content/[qrCode].js` - Dynamic content display page

**Components:**
- `components/Layout/DashboardLayout.js` - Main dashboard layout
- `components/Property/PropertyForm.js` - Property creation/editing form
- `components/Property/PropertyList.js` - Property listing component
- `components/Property/PropertyCard.js` - Property display card
- `components/Item/ItemForm.js` - Item creation/editing form
- `components/Item/ItemList.js` - Item listing component
- `components/Item/ItemCard.js` - Item display card
- `components/QR/QRGenerator.js` - QR code generation component
- `components/QR/QRDisplay.js` - QR code display component
- `components/Content/ContentPage.js` - Dynamic content display
- `components/Common/Navigation.js` - Navigation component
- `components/Common/Button.js` - Reusable button component
- `components/Common/Modal.js` - Modal dialog component

**Utilities:**
- `utils/api.js` - API client configuration
- `utils/constants.js` - Application constants
- `utils/helpers.js` - Helper functions
- `utils/validators.js` - Form validation utilities

**Hooks:**
- `hooks/useProperties.js` - Property management hook
- `hooks/useItems.js` - Item management hook
- `hooks/useQRCodes.js` - QR code management hook

### 3.4 Database Schema Files

**Supabase Migrations:**
- `supabase/migrations/001_initial_schema.sql` - Initial database schema
- `supabase/migrations/002_demo_user_setup.sql` - Demo user configuration
- `supabase/migrations/003_seed_data.sql` - Initial seed data

**Database Functions:**
- `supabase/functions/generate_qr_uuid.sql` - QR UUID generation function
- `supabase/functions/cleanup_deleted_items.sql` - Item deletion cleanup

### 3.5 Styling and Assets

**Styles:**
- `styles/globals.css` - Global styles
- `styles/components.css` - Component-specific styles
- `styles/dashboard.css` - Dashboard layout styles

**Assets:**
- `public/images/logo.png` - Application logo
- `public/images/icons/` - UI icons directory
- `public/favicon.ico` - Favicon

### 3.6 Configuration and Environment

**Environment Variables:**
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_KEY` - Supabase service role key
- `NODE_ENV` - Environment setting
- `PORT` - Server port configuration

### 3.7 Key Functions to Implement

**Backend Functions:**
- `PropertyController.createProperty()` - Create new property
- `PropertyController.listProperties()` - List all properties for demo user
- `ItemController.createItem()` - Create new item with location
- `ItemController.updateItemLocation()` - Update item location
- `ItemController.deleteItem()` - Delete item and cleanup QR codes
- `QRController.generateQRCode()` - Generate unique QR code for item
- `QRController.getQRMapping()` - Retrieve item data by QR code
- `ContentController.renderContentPage()` - Generate dynamic content page

**Frontend Functions:**
- `PropertyForm.handleSubmit()` - Handle property creation/editing
- `ItemForm.handleLocationAssignment()` - Handle item location assignment
- `QRGenerator.generateCode()` - Trigger QR code generation
- `QRDisplay.downloadQR()` - Download QR code image
- `ContentPage.fetchItemData()` - Fetch item data for content display

**Service Functions:**
- `QRService.generateUniqueCode()` - Generate unique QR UUID
- `QRService.createMapping()` - Create QR-to-item mapping
- `SupabaseService.query()` - Execute database queries
- `ValidationService.validateProperty()` - Validate property data
- `DemoUserService.getCurrentUser()` - Return hardcoded demo user

---

## 4. Technical Dependencies

### Required NPM Packages:
- **Backend**: express, cors, helmet, supabase, qrcode, uuid, joi
- **Frontend**: react, next, axios, react-hook-form, react-query
- **Development**: nodemon, jest, cypress, eslint, prettier

### External Services:
- **Supabase**: PostgreSQL database, authentication, storage
- **QR Library**: Node.js qrcode package for generation

---

## 5. Implementation Notes

### Architecture Decisions:
- Uses hardcoded "Demo User" to eliminate authentication complexity
- Implements hybrid Supabase + Node.js for scalability
- Focuses on proving value proposition before adding user management
- Establishes patterns for future Sprint MVP2 implementation

### Risk Mitigation:
- Start with backend foundation to ensure data integrity
- Implement comprehensive error handling for production readiness  
- Use established libraries for QR generation to reduce complexity
- Focus on core workflow completion over feature richness

### Success Validation:
- Complete property-to-content workflow must function end-to-end
- QR codes must generate unique, scannable codes
- Content pages must load correctly via direct URL
- All CRUD operations must work reliably

---

**Document Version**: 1.0  
**Reference**: [@docs/gen_requests.md](./gen_requests.md) - REQ-001  
**Architecture Reference**: [@docs/gen_architecture.md](./gen_architecture.md)  
**Backlog Reference**: [@docs/gen_backlogfull.md](./gen_backlogfull.md)  
**Sprint Reference**: [@docs/gen_devplan.md](./gen_devplan.md) - Sprint 1 MVP1  
**Last Updated**: June 30, 2025 