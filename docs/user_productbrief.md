

# **Development Brief: QR Code-Based Instructional System for Rental Properties**  
*Accelerated with LLM-Friendly Tools & Model Context Protocol (MCP)*  

---

## **1. Project Overview**  
### **Objective**  
Build a scalable web/mobile platform where property owners (e.g., Airbnb hosts) can:  
- Create "home presets" (e.g., 2-bedroom apartment).  
- Upload instructional content (video, PDF) or link to external media (YouTube).  
- Generate/print QR codes tied to items (e.g., washing machine, TV).  
- Guests scan QR codes to view content on a mobile-friendly page.  

### **Key Stakeholders**  
- **Hosts**: Primary users (create content, manage QR codes).  
- **Guests**: End users (scan QR codes for instructions).  
- **Admin**: Platform operators (monitor usage, handle payments).  

---

## **2. Why This Project?**  
- Solves a universal pain point: Guests waste time asking hosts how to use household items.  
- Scalable: Targets 7M+ Airbnb hosts (source: Airbnb 2023 report) and other rental markets (vacation rentals, corporate housing).  
- Monetizable: Tiered pricing (free for YouTube links, paid for hosted media/sticker orders).  

---

## **3. Core Features (Prioritized)**  
| Feature | Description |  
|---------|-------------|  
| **Guest QR Scan** | Guest scans QR code → redirected to a mobile-friendly page with video/PDF/YouTube embed. |  
| **Host Dashboard** | Web app to create properties, assign QR codes to items, upload media, and print QR codes. |  
| **QR Code System** | Generate unique QR codes (UUIDs) mapped to items; support self-printed or pre-printed sheets. |  
| **Media Hosting** | Free tier (YouTube links) + paid tier (host video/PDF via Supabase Storage). |  
| **Payments** | Stripe integration for paid media hosting and sticker orders (pre-printed QR sheets). |  

---

## **4. Technical Approach**  
### **LLM-Friendly Tools & Architecture**  
We’ll prioritize tools with strong LLM integration (e.g., code generation, documentation, testing) and use **Model Context Protocol (MCP)** to accelerate development.  

#### **Tech Stack**  
| Component | Tool | LLM/MCP Integration |  
|-----------|------|---------------------|  
| **Frontend** | React.js + TypeScript + Next.js | - Use GitHub Copilot/Cursor for code generation.<br>- AI writes React components (e.g., QR scanner, media player).<br>- Next.js for SSR (SEO for guest landing page). |  
| **Mobile App** | React Native | - AI generates camera QR scanner module (e.g., `react-native-camera`).<br>- MCP server connects to React Native CLI for code execution. |  
| **Backend** | Node.js + Express + Supabase Client | - AI writes API endpoints (e.g., `/api/qr/generate`).<br>- Express routes with Supabase client for database operations.<br>- MCP server runs backend code in dev mode. |  
| **Database** | Supabase PostgreSQL | - AI writes Supabase queries (e.g., "Find all items for property X").<br>- Use Supabase client library; AI generates database operations. |  
| **QR Code Service** | `qrcode` (Node.js) | - AI writes QR generation logic (e.g., "Generate 10 codes for a 2-bedroom preset"). |  
| **Media Storage** | Supabase Storage | - AI writes Supabase Storage upload logic (e.g., signed URLs).<br>- MCP server runs Supabase CLI commands for storage management. |  
| **Auth** | Supabase Auth | - AI writes Supabase Auth integration (e.g., "Add login button to React app").<br>- JWT validation via Supabase client. |  
| **Payments** | Stripe + Supabase Edge Functions | - AI writes Stripe API calls integrated with Supabase webhooks.<br>- Edge Functions handle payment processing logic. |  

#### **MCP Server Setup**  
We’ll use **Model Context Protocol (MCP)** to let LLMs interact directly with development tools (e.g., run code, query databases, deploy). Example MCP servers:  
- **Code Execution**: Run backend/frontend code in dev mode (e.g., `npm run dev`).  
- **Supabase Access**: Query Supabase database and manage tables (e.g., "Show all users with >5 properties").  
- **File System**: Read/write code files (e.g., "Update the QR generation function in `qr-service.ts`").  
- **Documentation**: Generate API docs (Swagger) or user guides via AI.  

---

## **5. Phases & Tasks**  
*Each phase is LLM/MCP-accelerated. Team members will collaborate with AI to complete tasks.*  

### **Phase 1: Discovery & Setup (Weeks 1–2)**  
#### **Goal**: Finalize requirements, set up tools, and train the team on LLM/MCP.  
- **Tasks**:  
  1. **Stakeholder Interviews**: Hosts (5–10) to confirm feature priorities (e.g., "Do they prefer self-printed or pre-printed QR sheets?").  
  2. **Toolchain Setup**:  
     - Install Node.js, React, React Native, Supabase CLI.  
     - Set up MCP servers (e.g., `mcp-server-code` for code execution, `mcp-server-supabase` for Supabase access).  
     - Configure AI tools (GitHub Copilot, Cursor) for the team.  
  3. **LLM Training**:  
     - Feed the project brief, user interviews, and tech stack to the LLM (e.g., "You’re our AI assistant—help generate React components, API endpoints, and QR logic").  
- **MCP Use Case**: Ask LLM to "List all tools we need to install" and run setup commands via MCP.  

---

### **Phase 2: Core Backend Development (Weeks 3–6)**  
#### **Goal**: Build the API, QR system, and database.  
- **Key Tasks**:  
  1. **Database Schema**:  
     - AI writes Supabase schema for tables: `User`, `Property`, `Item`, `QRCode`, `MediaAsset`.  
     - MCP runs Supabase migrations to apply schema.  
  2. **API Endpoints**:  
     - AI generates Express routes (e.g., `POST /api/properties` to create a property).  
     - MCP tests endpoints (e.g., "Run `curl http://localhost:3000/api/properties` to confirm it works").  
  3. **QR Code Service**:  
     - AI writes a `qr-service.ts` module using `qrcode` (e.g., `generateQRCode(itemId: string): string`).  
     - MCP runs the service to generate sample QR codes.  
  4. **Auth Integration**:  
     - AI writes Supabase Auth setup (e.g., "Add Supabase Auth to React app; protect dashboard routes").  
     - MCP tests login flow (e.g., "Simulate a host login and check if JWT token is returned").  
- **MCP Use Case**: LLM writes API code → MCP runs `npm run dev` to test → LLM fixes errors based on logs.  

---

### **Phase 3: Frontend & Mobile App (Weeks 7–10)**  
#### **Goal**: Build the host dashboard and guest landing page.  
- **Key Tasks**:  
  1. **Host Dashboard (React Web)**:  
     - AI generates React components:  
       - `PropertyList.tsx` (list of properties).  
       - `ItemForm.tsx` (form to assign QR codes to items).  
       - `QRGenerator.tsx` (button to print/download QR codes).  
     - MCP runs `npm start` to preview changes.  
  2. **Guest Landing Page (Next.js)**:  
     - AI writes a static page that fetches item data via QR code ID (e.g., `https://platform.com/item/abc123`).  
     - Embeds YouTube player (react-youtube) or PDF viewer (react-pdf).  
  3. **Mobile App (React Native)**:  
     - AI generates a camera component using `react-native-camera` to scan QR codes.  
     - MCP tests on iOS/Android emulators (e.g., "Run `npx react-native run-ios`").  
- **MCP Use Case**: LLM writes React component → MCP runs app → LLM adjusts based on UI feedback.  

---

### **Phase 4: Media & Payments (Weeks 11–14)**  
#### **Goal**: Implement media hosting and Stripe integration.  
- **Key Tasks**:  
  1. **Supabase Storage Setup**:  
     - AI writes Supabase Storage upload logic (e.g., `uploadToSupabase(file: File): string`).  
     - MCP runs Supabase Storage commands to test uploads.  
  2. **Paid Media Tiers**:  
     - AI writes logic to check user’s subscription tier (e.g., "If user has 5GB limit, block uploads over limit").  
  3. **Stripe Integration**:  
     - AI writes Stripe checkout flow (e.g., "Create a subscription for $10/month").  
     - MCP tests payments (e.g., "Simulate a $5 payment and check if webhook updates user’s storage quota").  
- **MCP Use Case**: LLM writes Supabase Storage upload code → MCP runs Supabase commands to confirm file exists.  

---

### **Phase 5: Testing & Launch (Weeks 15–16)**  
#### **Goal**: Validate all features and deploy.  
- **Key Tasks**:  
  1. **Testing**:  
     - AI writes unit tests (Jest) for backend APIs (e.g., "Test if QR code generation returns a 200 status").  
     - AI writes Cypress tests for frontend (e.g., "Test if guest landing page loads after QR scan").  
     - MCP runs tests (e.g., `npm test`).  
  2. **Deployment**:  
     - AI writes deployment configuration for frontend and backend.  
     - MCP runs Supabase deployment commands for Edge Functions.  
     - Deploy to Vercel/Netlify (frontend) and Supabase (backend functions).  
  3. **Launch**:  
     - Soft launch with 10 beta hosts (recruited via Airbnb forums).  
     - AI writes a launch email template (e.g., "Hi [Host Name], try our QR system—free for 30 days!").  
- **MCP Use Case**: LLM writes test → MCP runs test → LLM fixes failures.  

---

## **6. Success Metrics**  
- **Host Adoption**: 100+ active hosts in first 3 months.  
- **Guest Engagement**: 80% of QR scans result in content views (no bounces).  
- **Monetization**: 20% of hosts upgrade to paid media tier.  

---

## **7. LLM/MCP Support**  
- **Code Generation**: Use GitHub Copilot/Cursor to write React/Node.js code.  
- **Debugging**: LLM analyzes error logs (e.g., "Why is the QR page not loading?") and suggests fixes.  
- **Documentation**: AI writes user guides (e.g., "How to create a home preset") and API docs (Swagger).  

