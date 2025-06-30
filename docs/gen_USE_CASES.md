# Use Cases Documentation

This document contains detailed use cases that demonstrate the user experience and value proposition for each major feature set of the QR Code-Based Instructional System.

**Document Created**: June 30, 2025 14:15 CEST

---

## UC-001: Sprint 1 MVP Demo - Complete Content Creation Workflow

**Related Request**: REQ-001  
**Sprint**: Sprint 1 - MVP1 Content Creation & QR Generation  
**User Type**: Vacation Rental Host (Demo User)  
**Date Created**: June 30, 2025 14:15 CEST

### Use Case Overview
Demonstrates the complete end-to-end workflow that should be functional at the end of Sprint 1, proving the core value proposition without authentication complexity using a hardcoded "Demo User".

### Scenario
Sarah owns a vacation rental cabin in the mountains and wants to provide guests with easy access to instructional information for various appliances and amenities throughout the property.

### Pre-conditions
- Application is running (backend + frontend)
- Demo User is hardcoded and active
- No authentication required for this demo

### Main Success Scenario

#### Step 1: Property Setup
**Action**: Sarah accesses the web application and creates her property
- Opens the application homepage
- Clicks "Create New Property" 
- Fills out property details:
  - Name: "Mountain View Cabin"
  - Address: "123 Pine Trail, Aspen, CO"
  - Description: "Cozy 3-bedroom mountain retreat"
- Clicks "Save Property"

**Expected Result**: Property is created and appears in the property listing

#### Step 2: Location Management
**Action**: Sarah adds specific locations within her property
- Selects "Mountain View Cabin" from property list
- Clicks "Add Location"
- Creates multiple locations:
  - "Kitchen" 
  - "Living Room"
  - "Master Bedroom"
  - "Hot Tub Area"
- Each location is saved successfully

**Expected Result**: All locations are visible in the property's location list

#### Step 3: Item Registration
**Action**: Sarah adds items that need instructions at each location
- Navigates to "Kitchen" location
- Clicks "Add Item"
- Creates items with details:
  - Item 1:
    - Name: "Espresso Machine"
    - Description: "Breville Barista Express"
    - Instructions: "How to make the perfect espresso"
    - Category: "Appliance"
  - Item 2:
    - Name: "Dishwasher"
    - Description: "Bosch 500 Series"
    - Instructions: "Loading and operating instructions"
    - Category: "Appliance"

- Navigates to "Hot Tub Area"
- Adds item:
  - Name: "Hot Tub Controls"
  - Description: "Jacuzzi J-475 Control Panel"
  - Instructions: "Temperature control and jet settings"
  - Category: "Amenity"

**Expected Result**: All items are created and properly associated with their locations

#### Step 4: QR Code Generation
**Action**: Sarah generates QR codes for each item
- Views item "Espresso Machine"
- Clicks "Generate QR Code"
- QR code is created and displayed
- Repeats process for "Dishwasher" and "Hot Tub Controls"

**Expected Result**: 
- Each item has a unique QR code generated
- QR codes are properly mapped to their respective items
- QR codes are downloadable/printable

#### Step 5: Content Page Verification
**Action**: Sarah tests the content pages by accessing direct URLs
- Copies the direct URL for the Espresso Machine content page
- Opens URL in new browser tab/mobile device
- Views the dynamically generated content page

**Expected Result**: 
- Content page displays correctly with:
  - Item name: "Espresso Machine"
  - Description: "Breville Barista Express" 
  - Instructions: "How to make the perfect espresso"
  - Property context: "Mountain View Cabin - Kitchen"
  - Clean, mobile-friendly layout

#### Step 6: Item Management
**Action**: Sarah demonstrates item lifecycle management
- Edits the "Dishwasher" description
- Deletes an item she no longer needs
- Views updated property overview

**Expected Result**: 
- Changes are saved and reflected immediately
- Deleted items are removed from the system
- Property overview shows current accurate state

### Post-conditions
At the end of this use case, Sarah has:
1. ✅ Created a complete property with multiple locations
2. ✅ Added items with detailed instructional information
3. ✅ Generated unique QR codes for each item
4. ✅ Verified that content pages load correctly via direct URLs
5. ✅ Demonstrated item management capabilities

### Value Demonstrated
- **Host Value**: Easy content creation and organization system
- **Guest Value**: Direct access to helpful instructions (proven via direct URL)
- **Technical Proof**: End-to-end workflow without authentication complexity
- **Business Value**: Core value proposition validated before adding user management

### Success Criteria for Sprint 1 Completion
This use case should be 100% functional with:
- No authentication required (Demo User)
- All CRUD operations working for properties, locations, and items
- QR code generation and item mapping functional
- Dynamic content pages accessible via direct URLs
- Mobile-responsive content display
- Smooth, intuitive user interface

### Notes for Sprint 2
This foundation enables Sprint 2 to add:
- QR code scanning functionality
- Mobile camera integration
- Enhanced mobile experience
- YouTube video integration

### Technical Reference
**Implemented Stories**: 2.1.1, 2.2.1, 3.1.1, 3.1.3, 3.2.3, 4.1.1, 4.2.1, 6.1.1  
**Architecture**: Hybrid Supabase + Node.js/Express stack  
**Total Story Points**: 42 points

---

## Testing Instructions for UC-001

### Pre-Testing Setup Verification

#### System Setup Check
```bash
# 1. Verify all services are running
npm run dev  # Frontend (Next.js)
node server.js  # Backend (Node.js/Express)

# 2. Check database connectivity
# Verify Supabase connection is active
# Confirm Demo User is hardcoded and accessible
```

#### Environment Verification
- ✅ Frontend accessible at `http://localhost:3002`
- ✅ Backend API accessible at `http://localhost:8000`
- ✅ Supabase database connected and seeded
- ✅ Demo User authentication bypassed

### Step-by-Step Testing Protocol

#### Test 1: Property Creation (Story 2.1.1)
**API Endpoint**: `POST /api/properties`  
**Frontend Page**: `src/pages/dashboard/properties/index.tsx`

**Steps**:
1. Navigate to `http://localhost:3002`
2. Click "Create New Property" button
3. Fill form with test data:
   ```
   Name: Mountain View Cabin
   Address: 123 Pine Trail, Aspen, CO
   Description: Cozy 3-bedroom mountain retreat
   ```
4. Submit form

**Validation Points**:
- ✅ Property appears in database
- ✅ Property shows in property list (`PropertyList.tsx`)
- ✅ Success message displayed
- ✅ Form resets after submission

**Database Check**:
```sql
SELECT * FROM properties WHERE name = 'Mountain View Cabin';
```

#### Test 2: Location Management (Story 3.1.3)
**API Endpoint**: `POST /api/properties/:id/locations`  
**Frontend Component**: Property management interface

**Steps**:
1. Select "Mountain View Cabin" from property list
2. Navigate to property details page
3. Add locations one by one:
   - Kitchen
   - Living Room
   - Master Bedroom
   - Hot Tub Area

**Validation Points**:
- ✅ Each location saved successfully
- ✅ Locations appear in property's location list
- ✅ Location IDs properly linked to property

#### Test 3: Item Registration (Story 3.1.1)
**API Endpoint**: `POST /api/items`  
**Frontend Component**: `ItemForm.tsx`

**Steps**:
1. Navigate to "Kitchen" location
2. Click "Add Item"
3. Create Espresso Machine item:
   ```
   Name: Espresso Machine
   Description: Breville Barista Express
   Instructions: How to make the perfect espresso
   Category: Appliance
   Location: Kitchen
   ```
4. Repeat for Dishwasher and Hot Tub Controls

**Validation Points**:
- ✅ Items saved with correct location association
- ✅ All fields properly stored
- ✅ Items appear in location's item list

**Database Check**:
```sql
SELECT i.*, l.name as location_name 
FROM items i 
JOIN locations l ON i.location_id = l.id 
WHERE i.name = 'Espresso Machine';
```

#### Test 4: QR Code Generation (Stories 4.1.1, 4.2.1)
**API Endpoint**: `POST /api/qr/generate`  
**Frontend Component**: `QRGenerator.tsx`

**Steps**:
1. View "Espresso Machine" item
2. Click "Generate QR Code" button
3. Verify QR code displays
4. Repeat for other items

**Validation Points**:
- ✅ Unique UUID generated for each QR code
- ✅ QR code properly mapped to item (`QRService.ts`)
- ✅ QR code image renders correctly
- ✅ QR code contains correct URL format

**Technical Check**:
```javascript
// Verify QR code function
const qrCode = generateQRCode(itemId);
console.log(qrCode.url); // Should be: /qr/{uuid}
```

#### Test 5: Dynamic Content Pages (Story 6.1.1)
**API Endpoint**: `GET /api/qr/:id`  
**Frontend Page**: `src/pages/qr/[id].tsx`

**Steps**:
1. Copy QR code URL from generated code
2. Open URL in new browser tab
3. Test on mobile device/responsive view
4. Verify content displays correctly

**Validation Points**:
- ✅ Content page loads without errors
- ✅ Item details display correctly:
  - Item name: "Espresso Machine"
  - Description: "Breville Barista Express"
  - Instructions: "How to make the perfect espresso"
  - Property context: "Mountain View Cabin - Kitchen"
- ✅ Mobile-responsive layout works
- ✅ Page loads quickly (<2 seconds)

**URL Format Check**:
```
Expected: http://localhost:3002/qr/{uuid}
Should resolve to item content page
```

#### Test 6: Item Management (Story 3.2.3)
**API Endpoints**: `PUT /api/items/:id`, `DELETE /api/items/:id`

**Steps**:
1. Edit "Dishwasher" description
2. Save changes
3. Delete a test item
4. Verify property overview updates

**Validation Points**:
- ✅ Edit saves successfully
- ✅ Changes reflect immediately in UI
- ✅ Delete removes item completely
- ✅ QR codes for deleted items become invalid
- ✅ Property overview shows accurate counts

### Error Testing
**Invalid QR Code Test**:
1. Navigate to `http://localhost:3002/qr/invalid-uuid`
2. Should show error page with helpful message

**Network Error Test**:
1. Stop backend server
2. Try creating property
3. Should show appropriate error handling

### Performance Testing
- ✅ Property creation: < 1 second
- ✅ QR generation: < 2 seconds
- ✅ Content page load: < 2 seconds
- ✅ Image rendering: < 3 seconds

### Mobile Testing
**Required Tests on Mobile Device**:
1. Access content pages via QR URL
2. Verify responsive layout
3. Test touch interactions
4. Verify text readability

### Success Criteria Checklist
- [ ] All 6 test scenarios pass completely
- [ ] No console errors in browser
- [ ] No server errors in logs
- [ ] Database records created correctly
- [ ] QR codes generate unique UUIDs
- [ ] Content pages load on mobile
- [ ] All CRUD operations functional
- [ ] Demo User workflow requires no authentication

**Testing Complete**: When all checkboxes are ✅, UC-001 is validated and Sprint 1 is ready for demo.

---

**Document Version**: 1.1  
**Last Updated**: June 30, 2025 14:15 CEST 