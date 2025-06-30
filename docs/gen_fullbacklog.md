

### **User Stories for QR Code-Based Instructional System**  
*(Prioritized by MoSCoW: **M**ust have, **S**hould have, **C**ould have, **W**on’t have)*  

---

#### **1. Guest QR Code Scanning & Content Access**  
**User Story**:  
*As a guest, I want to scan a QR code on a rental item so I can view instructions (video, PDF, or YouTube) on my mobile device.*  

**Acceptance Criteria**:  
- QR code redirects to a mobile-friendly page.  
- Page displays content (video, PDF, or embedded YouTube).  
- Page loads within 3 seconds on 4G.  

**Story Points**: 5  
**MoSCoW**: **M**  

---

#### **2. Host Login & Dashboard Access**  
**User Story**:  
*As a host, I want to log into the platform so I can manage my properties and QR codes.*  

**Acceptance Criteria**:  
- Login with email/password or Google.  
- Dashboard displays properties and items.  

**Story Points**: 3  
**MoSCoW**: **M**  

---

#### **3. Create/Edit Property Preset (e.g., 2-Bedroom Apartment)**  
**User Story**:  
*As a host, I want to create a "home preset" (e.g., 2-bedroom) so I can standardize QR code setups for similar properties.*  

**Acceptance Criteria**:  
- Preset includes pre-defined items (e.g., TV, washing machine).  
- Host can customize preset (add/remove items).  

**Story Points**: 5  
**MoSCoW**: **M**  

---

#### **4. Upload Media (YouTube or External Link)**  
**User Story**:  
*As a host, I want to link YouTube videos or external URLs to QR codes so I can provide free instructions.*  

**Acceptance Criteria**:  
- Host can input a URL (YouTube, PDF, or webpage).  
- Guest landing page embeds YouTube video or displays link.  

**Story Points**: 3  
**MoSCoW**: **M**  

---

#### **5. Generate & Print QR Codes (Option A: Self-Print)**  
**User Story**:  
*As a host, I want to generate QR codes for items in my property so I can print and attach them.*  

**Acceptance Criteria**:  
- QR codes are unique and tied to specific items.  
- Option to download PDF with QR codes for printing.  

**Story Points**: 5  
**MoSCoW**: **M**  

---

#### **6. Order Pre-Printed QR Stickers (Option A)**  
**User Story**:  
*As a host, I want to order pre-printed QR stickers through the platform so I can avoid printing them myself.*  

**Acceptance Criteria**:  
- Host selects sticker quantity and checks out via Stripe.  
- Order confirmation email sent.  

**Story Points**: 5  
**MoSCoW**: **S**  

---

#### **7. Register Pre-Printed QR Sheet (Option B)**  
**User Story**:  
*As a host, I want to register a pre-printed QR sheet (e.g., from Amazon) so I can assign codes to items.*  

**Acceptance Criteria**:  
- Host enters sheet ID; system maps all codes to their account.  
- Codes appear in dashboard for content assignment.  

**Story Points**: 5  
**MoSCoW**: **S**  

---

#### **8. Upload Hosted Media (Paid Tier)**  
**User Story**:  
*As a host, I want to upload videos/PDFs directly to the platform so I can host content without third-party links.*  

**Acceptance Criteria**:  
- File upload via drag-and-drop or file picker.  
- Video streams via Supabase Storage.  
- Paid tier limits enforced (e.g., 5GB storage).  

**Story Points**: 8  
**MoSCoW**: **S**  

---

#### **9. Payment Integration for Media Hosting/Stickers**  
**User Story**:  
*As a host, I want to pay for media hosting or stickers so I can unlock paid features.*  

**Acceptance Criteria**:  
- Stripe integration for one-time or subscription payments.  
- Payment confirmation updates storage/orders.  

**Story Points**: 5  
**MoSCoW**: **S**  

---

#### **10. Admin Dashboard for Analytics**  
**User Story**:  
*As an admin, I want to view usage metrics (e.g., scans, storage) so I can monitor platform performance.*  

**Acceptance Criteria**:  
- Dashboard shows daily/weekly active users, storage usage, and QR scans.  

**Story Points**: 5  
**MoSCoW**: **C**  

---

#### **11. Multi-Language Support for Guests**  
**User Story**:  
*As a guest, I want the content page to display in my language so I can understand instructions.*  

**Acceptance Criteria**:  
- Auto-detect browser language or allow manual selection.  
- Supports English, Spanish, French, and Japanese.  

**Story Points**: 8  
**MoSCoW**: **C**  

---

#### **12. Bulk QR Code Assignment for Pre-Printed Sheets**  
**User Story**:  
*As a host, I want to assign content to multiple QR codes at once (e.g., 50 codes on a sheet) so I can save time.*  

**Acceptance Criteria**:  
- Upload CSV mapping QR codes to item names/URLs.  

**Story Points**: 5  
**MoSCoW**: **W**  

---

#### **13. Individual Item Management**  
**User Story**:  
*As a host, I want to add/edit/delete individual items in my properties so I can customize each rental beyond the preset template.*  

**Acceptance Criteria**:  
- Add new items to existing properties with name, description, and location.  
- Edit item details (name, description, location).  
- Delete items and handle orphaned QR codes gracefully.  
- View all items for a specific property in an organized list.  

**Story Points**: 3  
**MoSCoW**: **M**  

---

#### **14. Content Update/Edit**  
**User Story**:  
*As a host, I want to edit or replace content assigned to QR codes so I can keep instructions current.*  

**Acceptance Criteria**:  
- Update YouTube URLs or external links for existing items.  
- Replace uploaded files with new versions.  
- View content assignment history for auditing.  
- Content changes reflect immediately for guest access.  

**Story Points**: 3  
**MoSCoW**: **M**  

---

#### **15. Guest Error Handling**  
**User Story**:  
*As a guest, I want to see helpful error messages when QR codes don't work so I can still get assistance or report issues.*  

**Acceptance Criteria**:  
- Display user-friendly messages for invalid/expired QR codes.  
- Provide alternative contact information (host details, property support).  
- Allow guests to report broken QR codes or content issues.  
- Show loading states and retry options for slow connections.  

**Story Points**: 3  
**MoSCoW**: **M**  

---

#### **16. QR Code Status Management**  
**User Story**:  
*As a host, I want to deactivate/reactivate QR codes and view scan statistics so I can manage my QR code system effectively.*  

**Acceptance Criteria**:  
- Toggle QR codes between active/inactive status.  
- View scan count and last accessed date for each QR code.  
- Generate reports on QR code usage across properties.  
- Bulk activate/deactivate QR codes for property management.  

**Story Points**: 5  
**MoSCoW**: **S**  

---

#### **17. Property Instance Management**  
**User Story**:  
*As a host, I want to create and manage individual property instances from presets so I can handle multiple rentals efficiently.*  

**Acceptance Criteria**:  
- Create property instances from presets with unique names/addresses.  
- Customize items per property instance (add/remove from preset).  
- Clone existing properties to create new instances quickly.  
- Manage multiple properties from a unified dashboard.  

**Story Points**: 5  
**MoSCoW**: **S**  

---

#### **18. Content Validation**  
**User Story**:  
*As a host, I want the system to validate YouTube links and uploaded files so guests don't encounter broken content.*  

**Acceptance Criteria**:  
- Verify YouTube URLs are accessible and video exists.  
- Check uploaded file integrity and format support.  
- Display content status indicators (working, broken, pending).  
- Send notifications when content becomes unavailable.  

**Story Points**: 3  
**MoSCoW**: **S**  

---

### **Prioritization Summary**  
| **MoSCoW** | **Stories** |  
|------------|-------------|  
| **Must Have** | 1, 2, 3, 4, 5, 13, 14, 15 |  
| **Should Have** | 6, 7, 8, 9, 16, 17, 18 |  
| **Could Have** | 10, 11 |  
| **Won’t Have** | 12 |  

--- 