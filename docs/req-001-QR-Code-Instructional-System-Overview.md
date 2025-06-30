# Request #001 - QR Code-Based Instructional System Implementation Overview

**Reference**: `docs/gen_requests.md` - Request #001  
**Date**: January 2, 2025  
**Total Story Points**: 89 (MVP: 21 points)  
**Estimated Timeline**: MVP 4-6 weeks, Full Implementation 3-4 months

---

## Project Goals

### Primary Objective
Build a scalable web/mobile platform enabling property owners (Airbnb hosts) to create instructional content systems using QR codes for rental property items.

### Core Functionality Goals
1. **Guest Experience**: Scan QR codes → Access instructional content on mobile devices
2. **Host Management**: Create properties, manage items, upload content, generate QR codes
3. **Content Flexibility**: Support YouTube links (free) and hosted media (paid)
4. **Monetization**: Tiered pricing for media hosting and physical QR sticker orders
5. **Scalability**: Multi-tenant architecture supporting thousands of hosts

---

## Implementation Order & Phases

### Phase 1: Foundation & Authentication (Sprint 1)
**Goal**: Enable hosts to log in and manage basic property/item data  
**Stories**: #2, #3, #4 (11 story points)

#### 1.1 Project Setup & Infrastructure
- Initialize React/Next.js frontend project
- Setup Supabase project integration
- Configure Supabase PostgreSQL database and Edge Functions
- Setup development environment and tooling

#### 1.2 Authentication System
- Integrate Auth0 for user authentication
- Create protected routes and middleware
- Implement login/logout functionality

#### 1.3 Database Schema & Core Models
- Design and implement database schema
- Create User, Property, Item, and QRCode models
- Setup database migrations

#### 1.4 Host Dashboard Foundation
- Create basic dashboard layout and navigation
- Implement property CRUD operations
- Build item management interface

#### 1.5 Media Link Integration
- Implement YouTube URL validation and storage
- Create external link management system
- Build content preview functionality

### Phase 2: QR System & Guest Access (Sprint 2)
**Goal**: Complete MVP with QR generation and guest content access  
**Stories**: #1, #5 (10 story points)

#### 2.1 QR Code Generation System
- Implement UUID-based QR code generation
- Create QR code to item mapping system
- Build printable QR code PDF generation

#### 2.2 Guest Landing Pages
- Create mobile-optimized content display pages
- Implement YouTube video embedding
- Add external link redirection handling

#### 2.3 QR Scanning Integration
- Setup QR code URL routing system
- Implement content retrieval by QR code ID
- Add error handling for invalid/expired codes

### Phase 3: Enhanced Features (Post-MVP)
**Goal**: Add paid features and advanced functionality  
**Stories**: #6, #7, #8, #9 (23 story points)

#### 3.1 Media Hosting System
- Integrate AWS S3 for file storage
- Implement CloudFront CDN distribution
- Create file upload and management system

#### 3.2 Payment Integration
- Integrate Stripe for subscription and one-time payments
- Implement storage tier management
- Create sticker ordering system

#### 3.3 Advanced QR Management
- Support for pre-printed QR sheet registration
- Bulk QR code assignment features
- Advanced analytics and tracking

### Phase 4: Administration & Optimization
**Goal**: Platform management and performance optimization  
**Stories**: #10, #11 (13 story points)

#### 4.1 Admin Dashboard
- Create admin interface for platform monitoring
- Implement usage analytics and reporting
- Add user management capabilities

#### 4.2 Internationalization
- Implement multi-language support
- Add localization for key markets
- Create language detection and switching

---

## Authorized Files and Functions for Modification

### Frontend (React/Next.js)
#### Core Application Files
- `src/App.tsx` - Main application component and routing
- `src/index.tsx` - Application entry point
- `next.config.js` - Next.js configuration
- `package.json` - Frontend dependencies and scripts

#### Pages
- `src/pages/index.tsx` - Landing page
- `src/pages/dashboard/index.tsx` - Host dashboard main page
- `src/pages/dashboard/properties/[id].tsx` - Property management page
- `src/pages/dashboard/items/[id].tsx` - Item management page
- `src/pages/qr/[id].tsx` - Guest QR code landing page
- `src/pages/auth/login.tsx` - Authentication login page
- `src/pages/auth/callback.tsx` - Auth0 callback handler

#### Components
- `src/components/Layout/DashboardLayout.tsx` - Dashboard layout wrapper
- `src/components/Layout/GuestLayout.tsx` - Guest page layout
- `src/components/Auth/LoginButton.tsx` - Authentication component
- `src/components/Auth/LogoutButton.tsx` - Logout functionality
- `src/components/Auth/ProtectedRoute.tsx` - Route protection wrapper
- `src/components/Property/PropertyList.tsx` - Property listing component
- `src/components/Property/PropertyForm.tsx` - Property creation/editing
- `src/components/Item/ItemList.tsx` - Item management component
- `src/components/Item/ItemForm.tsx` - Item creation/editing
- `src/components/QR/QRGenerator.tsx` - QR code generation interface
- `src/components/QR/QRDisplay.tsx` - QR code display component
- `src/components/Media/YouTubeEmbed.tsx` - YouTube video embedding
- `src/components/Media/MediaUpload.tsx` - File upload component

#### Services & Utilities
- `src/services/api.ts` - API client configuration and methods
- `src/services/auth.ts` - Auth0 integration service
- `src/services/qr.ts` - QR code generation utilities
- `src/utils/validation.ts` - Form validation helpers
- `src/utils/constants.ts` - Application constants
- `src/hooks/useAuth.tsx` - Authentication React hook
- `src/hooks/useApi.tsx` - API integration hooks

### Backend (Node.js/Express)
#### Core Application Files
- `src/app.ts` - Express application setup
- `src/server.ts` - Server startup and configuration
- `src/config/database.ts` - Database connection configuration
- `src/config/auth.ts` - Auth0 configuration
- `package.json` - Backend dependencies and scripts

#### API Routes
- `src/routes/auth.ts` - Authentication routes
- `src/routes/users.ts` - User management endpoints
- `src/routes/properties.ts` - Property CRUD endpoints
- `src/routes/items.ts` - Item management endpoints
- `src/routes/qr.ts` - QR code generation and lookup endpoints
- `src/routes/media.ts` - Media upload and management endpoints

#### Controllers
- `src/controllers/AuthController.ts` - Authentication logic
- `src/controllers/UserController.ts` - User management functions
- `src/controllers/PropertyController.ts` - Property business logic
- `src/controllers/ItemController.ts` - Item management functions
- `src/controllers/QRController.ts` - QR code operations
- `src/controllers/MediaController.ts` - Media handling logic

#### Services
- `src/services/QRService.ts` - QR code generation and validation
- `src/services/MediaService.ts` - File upload and AWS S3 integration
- `src/services/ValidationService.ts` - Data validation utilities

#### Middleware
- `src/middleware/auth.ts` - Authentication verification
- `src/middleware/validation.ts` - Request validation
- `src/middleware/errorHandler.ts` - Error handling middleware
- `src/middleware/cors.ts` - CORS configuration

### Database (Prisma/PostgreSQL)
#### Schema and Migrations
- `prisma/schema.prisma` - Database schema definition
- `prisma/migrations/` - Database migration files
- `prisma/seed.ts` - Database seeding script

### Configuration Files
- `.env` - Environment variables (development)
- `.env.production` - Production environment variables
- `tsconfig.json` - TypeScript configuration (frontend)
- `server/tsconfig.json` - TypeScript configuration (backend)
- `.eslintrc.js` - ESLint configuration

### Documentation Files
- `README.md` - Project setup and usage instructions
- `docs/gen_USE_CASES.md` - Use case descriptions (to be updated)
- `docs/gen_techguide.md` - Technical guide (to be updated)
- `docs/component_guide.md` - Component documentation (to be updated)

---

## Key Functions by Feature

### Authentication System
- `authenticateUser(credentials)` - User login validation
- `generateJWT(user)` - JWT token generation
- `validateToken(token)` - Token verification middleware

### Property Management
- `createProperty(propertyData)` - New property creation
- `updateProperty(id, propertyData)` - Property modification
- `getPropertiesByUser(userId)` - User's property listing

### Item Management
- `createItem(itemData)` - New item creation
- `assignQRToItem(itemId, qrId)` - QR code assignment
- `getItemsByProperty(propertyId)` - Property's item listing

### QR Code System
- `generateQRCode(itemId)` - Unique QR code generation
- `validateQRCode(qrId)` - QR code validation
- `getItemByQR(qrId)` - Item lookup by QR code
- `generatePrintablePDF(qrCodes)` - PDF generation for printing

### Media Management
- `validateYouTubeURL(url)` - YouTube link validation
- `uploadToS3(file, userId)` - File upload to AWS S3 (Phase 3)
- `processMediaUpload(file, metadata)` - Media processing pipeline (Phase 3)

---

*Document created: January 2, 2025*  
*Reference: docs/gen_requests.md - Request #001* 