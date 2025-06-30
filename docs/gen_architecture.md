# Architecture Document: QR Code-Based Instructional System

**Project**: Request #001 - QR Code-Based Instructional System  
**Architecture**: Hybrid Supabase + Node.js/Express  
**Date**: January 2, 2025  
**Version**: 1.0

---

## 1. System Overview

The QR Code-Based Instructional System is a multi-tenant platform that enables property owners (hosts) to create digital instruction systems for rental properties using QR codes. Guests scan QR codes to access instructional content on mobile devices.

### Key Stakeholders
- **Hosts**: Create properties, manage items, upload content, generate QR codes
- **Guests**: Scan QR codes and access instructional content
- **Admins**: Monitor platform usage and manage system operations

---

## 2. High-Level Design (HDL) Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        M[Mobile Guests<br/>QR Scanner] 
        W[Web Dashboard<br/>React/Next.js]
        PWA[PWA/Mobile App<br/>React Native]
    end
    
    subgraph "API Gateway Layer"
        API[Express.js API<br/>Node.js Backend]
    end
    
    subgraph "Supabase Platform"
        Auth[Supabase Auth<br/>JWT + OAuth]
        DB[(Supabase PostgreSQL<br/>Database)]
        Storage[Supabase Storage<br/>File Management]
        Edge[Edge Functions<br/>Serverless Logic]
        RT[Real-time<br/>Live Updates]
    end
    
    subgraph "Custom Services"
        QR[QR Generation<br/>Service]
        PDF[PDF Generation<br/>Service]
        Media[Media Validation<br/>Service]
    end
    
    subgraph "External Services"
        Stripe[Stripe<br/>Payments]
        YouTube[YouTube API<br/>Content Validation]
        Email[Email Service<br/>Notifications]
    end
    
    %% Client connections
    M --> API
    W --> API
    PWA --> API
    
    %% API connections to Supabase
    API --> Auth
    API --> DB
    API --> Storage
    API --> RT
    
    %% API connections to custom services
    API --> QR
    API --> PDF
    API --> Media
    
    %% External service connections
    API --> Stripe
    Edge --> Stripe
    Media --> YouTube
    Edge --> Email
    
    %% Data flow
    QR --> DB
    PDF --> Storage
    Auth -.-> W
    Auth -.-> PWA
```

---

## 3. Component Architecture

### 3.1 Frontend Components

```mermaid
graph TD
    subgraph "Host Dashboard (React/Next.js)"
        Dashboard[Dashboard Layout]
        PropMgmt[Property Management]
        ItemMgmt[Item Management]
        QRMgmt[QR Code Management]
        MediaMgmt[Media Management]
        Analytics[Analytics Dashboard]
    end
    
    subgraph "Guest Experience"
        Landing[Guest Landing Page]
        Content[Content Display]
        Error[Error Handling]
    end
    
    subgraph "Authentication"
        Login[Login Component]
        Profile[User Profile]
        Protected[Protected Routes]
    end
    
    subgraph "Shared Components"
        Layout[Layout Components]
        Forms[Form Components]
        Utils[Utility Functions]
        API[API Client]
    end
    
    Dashboard --> PropMgmt
    Dashboard --> ItemMgmt
    Dashboard --> QRMgmt
    Dashboard --> MediaMgmt
    Dashboard --> Analytics
    
    Landing --> Content
    Landing --> Error
    
    Protected --> Dashboard
    Login --> Protected
    
    PropMgmt --> API
    ItemMgmt --> API
    QRMgmt --> API
    MediaMgmt --> API
    Content --> API
```

### 3.2 Backend Services Architecture

```mermaid
graph TB
    subgraph "Express.js API Layer"
        Router[API Router]
        Auth[Auth Middleware]
        Validation[Validation Middleware]
        ErrorHandler[Error Handler]
    end
    
    subgraph "Controllers"
        UserCtrl[User Controller]
        PropCtrl[Property Controller] 
        ItemCtrl[Item Controller]
        QRCtrl[QR Controller]
        MediaCtrl[Media Controller]
        PaymentCtrl[Payment Controller]
    end
    
    subgraph "Services"
        QRSvc[QR Generation Service]
        PDFSvc[PDF Generation Service]
        MediaSvc[Media Validation Service]
        EmailSvc[Email Service]
        SupabaseSvc[Supabase Client Service]
    end
    
    subgraph "Data Access Layer"
        UserDAO[User DAO]
        PropertyDAO[Property DAO]
        ItemDAO[Item DAO]
        QRDAO[QR Code DAO]
        MediaDAO[Media DAO]
    end
    
    Router --> Auth
    Auth --> Validation
    Validation --> UserCtrl
    Validation --> PropCtrl
    Validation --> ItemCtrl
    Validation --> QRCtrl
    Validation --> MediaCtrl
    Validation --> PaymentCtrl
    
    UserCtrl --> UserDAO
    PropCtrl --> PropertyDAO
    ItemCtrl --> ItemDAO
    QRCtrl --> QRSvc
    QRCtrl --> QRDAO
    MediaCtrl --> MediaSvc
    MediaCtrl --> MediaDAO
    
    QRSvc --> PDFSvc
    MediaSvc --> EmailSvc
    
    UserDAO --> SupabaseSvc
    PropertyDAO --> SupabaseSvc
    ItemDAO --> SupabaseSvc
    QRDAO --> SupabaseSvc
    MediaDAO --> SupabaseSvc
```

---

## 4. Data Architecture

### 4.1 Database Schema

```mermaid
erDiagram
    USERS {
        uuid id PK
        string email UK
        string name
        string avatar_url
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    PROPERTIES {
        uuid id PK
        uuid user_id FK
        string name
        string description
        string address
        string property_type
        jsonb settings
        timestamp created_at
        timestamp updated_at
    }
    
    ITEMS {
        uuid id PK
        uuid property_id FK
        string name
        string description
        string location
        string media_url
        string media_type
        jsonb metadata
        timestamp created_at
        timestamp updated_at
    }
    
    QR_CODES {
        uuid id PK
        uuid item_id FK
        string qr_id UK
        string status
        integer scan_count
        timestamp last_scanned
        timestamp created_at
        timestamp updated_at
    }
    
    MEDIA_ASSETS {
        uuid id PK
        uuid item_id FK
        string file_name
        string file_type
        string file_url
        integer file_size
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    SUBSCRIPTIONS {
        uuid id PK
        uuid user_id FK
        string stripe_subscription_id
        string plan_type
        string status
        timestamp current_period_end
        timestamp created_at
        timestamp updated_at
    }
    
    ANALYTICS {
        uuid id PK
        uuid qr_code_id FK
        string user_agent
        string ip_address
        jsonb metadata
        timestamp scanned_at
    }
    
    USERS ||--o{ PROPERTIES : "owns"
    PROPERTIES ||--o{ ITEMS : "contains"
    ITEMS ||--o{ QR_CODES : "has"
    ITEMS ||--o{ MEDIA_ASSETS : "has"
    USERS ||--o{ SUBSCRIPTIONS : "has"
    QR_CODES ||--o{ ANALYTICS : "tracks"
```

### 4.2 Data Flow Architecture

```mermaid
sequenceDiagram
    participant G as Guest
    participant API as Express API
    participant DB as Supabase DB
    participant S3 as Supabase Storage
    participant QRS as QR Service
    participant YT as YouTube API
    
    Note over G,YT: Host Creates Content Flow
    
    G->>API: Create Property
    API->>DB: Store Property Data
    
    G->>API: Add Item with YouTube URL
    API->>YT: Validate YouTube URL
    YT-->>API: URL Valid
    API->>DB: Store Item with Media URL
    
    G->>API: Generate QR Code
    API->>QRS: Generate Unique QR ID
    QRS-->>API: Return QR Code Data
    API->>DB: Store QR Code Mapping
    API->>S3: Store QR Code Image
    API-->>G: Return QR Code for Download
    
    Note over G,YT: Guest Scans QR Code Flow
    
    G->>API: Scan QR Code (GET /qr/:id)
    API->>DB: Lookup QR Code
    DB-->>API: Return Item Data
    API->>DB: Log Analytics
    API-->>G: Return Content Page with Media
```

---

## 5. Technology Stack

### 5.1 Frontend Stack
- **Framework**: React 18+ with TypeScript
- **Meta-Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + Headless UI
- **State Management**: React Query + Zustand
- **Authentication**: Supabase Auth Client

### 5.2 Backend Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database Client**: Supabase JavaScript Client
- **QR Generation**: `qrcode` + `uuid` libraries
- **PDF Generation**: `pdfkit`
- **Validation**: Zod schema validation

### 5.3 Infrastructure Stack
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **Payments**: Stripe API
- **Deployment**: Vercel (Frontend) + Railway (Backend)

---

## 6. Security Architecture

### 6.1 Authentication & Authorization

```mermaid
graph TD
    subgraph "Authentication Flow"
        Login[User Login]
        Auth[Supabase Auth]
        JWT[JWT Token]
        API[API Middleware]
    end
    
    subgraph "Authorization Layers"
        RLS[Row Level Security]
        RBAC[Role-Based Access]
        Resource[Resource Ownership]
    end
    
    subgraph "Security Controls"
        HTTPS[HTTPS/TLS]
        CORS[CORS Policy]
        Rate[Rate Limiting]
        Validation[Input Validation]
    end
    
    Login --> Auth
    Auth --> JWT
    JWT --> API
    
    API --> RLS
    API --> RBAC
    API --> Resource
    
    API --> HTTPS
    API --> CORS
    API --> Rate
    API --> Validation
```

### 6.2 Security Measures
- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **Data Protection**: HTTPS/TLS encryption in transit
- **Input Validation**: Zod schema validation on all inputs
- **Rate Limiting**: API rate limiting per user/IP
- **CORS**: Strict CORS policies for API access
- **File Security**: Signed URLs for file access

---

## 7. Deployment Architecture

### 7.1 Production Deployment

```mermaid
graph TB
    subgraph "Frontend Hosting"
        Vercel[Vercel<br/>Next.js App]
    end
    
    subgraph "Backend Hosting"
        Railway[Railway<br/>Express API]
    end
    
    subgraph "Supabase Cloud"
        DB[(PostgreSQL Database)]
        Auth[Auth Service]
        Storage[File Storage]
        Edge[Edge Functions]
    end
    
    subgraph "External Services"
        Stripe[Stripe API]
        Email[Email Service]
    end
    
    Vercel --> Railway
    Railway --> DB
    Railway --> Auth
    Railway --> Storage
    Railway --> Edge
    Railway --> Stripe
    Edge --> Email
```

### 7.2 Environment Configuration
- **Development**: Local Next.js + Local Express + Supabase
- **Staging**: Vercel Preview + Railway + Supabase (staging)
- **Production**: Vercel + Railway + Supabase (production)

---

## 8. Performance Considerations

### 8.1 Optimization Strategies
- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Connection pooling, query optimization, caching
- **Database**: Proper indexing, RLS optimization
- **CDN**: Static asset caching, edge caching
- **Real-time**: Selective subscriptions, connection management

### 8.2 Scalability Patterns
- **Horizontal Scaling**: Multiple backend instances behind load balancer
- **Database Scaling**: Supabase auto-scaling + read replicas
- **File Storage**: Supabase Storage with CDN distribution
- **Cache Strategy**: Redis for session and API response caching

---

## 9. Monitoring & Observability

### 9.1 Monitoring Stack
- **Application Monitoring**: Vercel Analytics + Sentry
- **Database Monitoring**: Supabase Dashboard + Alerts
- **API Monitoring**: Custom logging + error tracking
- **Performance Monitoring**: Core Web Vitals + API metrics

### 9.2 Key Metrics
- **Business Metrics**: QR scans, user registrations, conversions
- **Technical Metrics**: API response times, error rates, uptime
- **User Experience**: Page load times, mobile performance

---

## 10. Future Architecture Considerations

### 10.1 Scalability Roadmap
- **Microservices**: Split monolithic API into domain services
- **Event-Driven**: Implement event sourcing for analytics
- **Multi-Region**: Geographic distribution for global users
- **Mobile Apps**: Native iOS/Android applications

### 10.2 Technology Evolution
- **Backend**: Potential migration to Deno/Bun for performance
- **Frontend**: React 19+ features, Server Components optimization
- **Database**: Potential sharding strategies for large scale
- **AI Integration**: Content generation and optimization features

---

*Architecture Document Version 1.0 - January 2, 2025*  
*Next Review: March 2025* 