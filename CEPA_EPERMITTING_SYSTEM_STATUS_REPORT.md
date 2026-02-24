# CEPA e-Permitting System
## Comprehensive Progressive Status Report

**Document Version:** 1.0  
**Report Date:** December 31, 2024  
**System Name:** CEPA Environmental Permitting System  
**Organization:** Conservation and Environment Protection Authority (CEPA), Papua New Guinea

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Technology Stack](#3-technology-stack)
4. [User Roles & Access Control](#4-user-roles--access-control)
5. [Dashboard Modules](#5-dashboard-modules)
6. [Application Workflow](#6-application-workflow)
7. [Core Features](#7-core-features)
8. [Database Architecture](#8-database-architecture)
9. [Security & Compliance](#9-security--compliance)
10. [Current Development Status](#10-current-development-status)
11. [Known Limitations](#11-known-limitations)
12. [Recommendations & Next Steps](#12-recommendations--next-steps)

---

## 1. Executive Summary

The CEPA e-Permitting System is a comprehensive web-based application designed to digitize and streamline the environmental permitting process in Papua New Guinea under the PNG Environment Act 2000. The system enables:

- **Public applicants** to register entities, submit intent registrations, and apply for environmental permits
- **CEPA staff** across multiple units (Registry, Compliance, Revenue, Finance, Directorate) to review, assess, and process applications
- **Managing Director** to provide final approvals and sign-off on permits
- **Super Administrators** to manage system configuration, users, and database operations

The system implements a multi-stage workflow from application submission through final approval, with built-in fee calculation, GIS mapping, document management, and comprehensive audit logging.

---

## 2. System Overview

### 2.1 Purpose

The CEPA e-Permitting System replaces manual paper-based processes with a fully digital workflow for environmental permit management. It supports:

- Intent Registration for Level 1, 2, and 3 environmental activities
- Environmental Permit Applications (new, renewal, amendment, transfer, surrender, amalgamation)
- Compliance monitoring and reporting
- Revenue collection and fee management
- Executive oversight and final approvals

### 2.2 Key Stakeholders

| Stakeholder | Role in System |
|-------------|----------------|
| Public Applicants | Submit applications, upload documents, track status |
| Registry Unit | Initial review, document verification, allocation |
| Compliance Unit | Technical environmental assessment |
| Revenue Unit | Fee calculation, invoice generation, payment verification |
| Finance Unit | Financial oversight and reconciliation |
| Directorate | Strategic oversight and management |
| Managing Director | Final approval authority |
| Super Admin | System administration and configuration |

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.3.1 | UI Framework |
| TypeScript | - | Type-safe development |
| Vite | - | Build tooling |
| Tailwind CSS | - | Styling framework |
| Shadcn/UI | - | Component library |
| React Router DOM | ^6.26.2 | Client-side routing |
| TanStack React Query | ^5.56.2 | Server state management |
| Lucide React | ^0.552.0 | Icon library |
| Recharts | ^2.12.7 | Data visualization |
| Mapbox GL | ^3.13.0 | GIS mapping |

### 3.2 Backend

| Technology | Purpose |
|------------|---------|
| Supabase | Backend-as-a-Service (PostgreSQL, Auth, Storage, Edge Functions) |
| PostgreSQL | Database |
| Row Level Security (RLS) | Data access control |

### 3.3 Additional Libraries

- **Document Generation:** docx, jspdf, xlsx
- **Date Handling:** date-fns
- **Form Management:** react-hook-form, zod
- **File Handling:** file-saver
- **GIS Processing:** @turf/area, @turf/boolean-point-in-polygon

---

## 4. User Roles & Access Control

### 4.1 User Types (Enum: `user_type`)

| Type | Description |
|------|-------------|
| `public` | External applicants (individuals, companies, organizations) |
| `staff` | CEPA internal staff members |
| `admin` | Administrative users with elevated privileges |
| `super_admin` | Full system access for configuration |

### 4.2 Staff Units (Enum: `staff_unit`)

| Unit | Primary Responsibilities |
|------|-------------------------|
| `registry` | Application intake, document verification, initial review |
| `compliance` | Environmental technical assessment, inspections |
| `revenue` | Fee calculation, invoicing, payment collection |
| `finance` | Financial oversight, budget management, reconciliation |
| `directorate` | Strategic oversight, executive functions |
| `ict` | IT support and system maintenance |

### 4.3 Staff Positions (Enum: `staff_position`)

| Position | Access Level |
|----------|-------------|
| `officer` | Operational tasks, assigned work items |
| `manager` | Team management, work allocation, reporting |
| `director` | Unit leadership, approval authority |
| `managing_director` | Final approval authority, organizational oversight |

### 4.4 Route Protection

The system implements role-based route protection using the `ProtectedRoute` component, ensuring users can only access dashboards and features appropriate to their role, unit, and position.

---

## 5. Dashboard Modules

### 5.1 Public Dashboard (`/dashboard`)

**Purpose:** Applicant portal for managing environmental permit applications

**Key Features:**
- Application guide with process overview
- Entity management (register companies/individuals)
- Intent registration (new and existing)
- Permit application submission
- Permit lifecycle management:
  - Amendments
  - Renewals
  - Transfers
  - Surrenders
  - Amalgamations
- Invoice and payment tracking
- Document management
- Notification center
- Compliance inspections view
- Compliance report submissions
- Profile and settings management

**Sidebar Navigation:**
- Dashboard (Application Guide)
- Activity Overview
- Entities
- Intent Registration (New/Existing)
- Permit Applications (New/Existing)
- Permit Management submenu
- Invoices & Payments
- Documents
- Compliance
- Notifications
- Profile & Settings

---

### 5.2 Registry Dashboard (`/registry`, `/RegistryDashboard`)

**Purpose:** Registry unit operations for initial application review and processing

**Key Features:**
- Dashboard KPIs:
  - Total Entities
  - Active Permits
  - Pending Applications
  - Pending Payments
  - Expiring Soon (within 30 days)
- GIS Map visualization of approved permits
- Recent activities feed
- Application review capabilities:
  - Intent registration reviews
  - Permit application reviews
  - Amendment reviews
  - Renewal reviews
  - Transfer reviews
  - Surrender reviews
  - Amalgamation reviews
  - Compliance reviews
  - Enforcement reviews
- Entity and permit listings
- Document management
- Compliance reporting
- Staff management (manager only)
- Notifications panel
- Analytics and reports
- User guide

**Manager-specific Features:**
- Work allocation dialog
- Team management
- Report generation

---

### 5.3 Compliance Dashboard (`/ComplianceDashboard`)

**Purpose:** Environmental technical assessment and compliance monitoring

**Key Features:**
- Environment Assessment Dashboard
- Inspections management
- Compliance reports management
- Permit applications list
- Assessment reviews:
  - Intent registration compliance review
  - Permit amalgamation compliance review
  - Permit amendment compliance review
  - Permit compliance report review
  - Permit enforcement compliance review
  - Permit renewal compliance review
  - Permit surrender compliance review
  - Permit transfer compliance review
- Analytics and reporting
- Staff management (manager only)
- User guide

**Assessment Workflow:**
- Technical environmental assessment
- Compliance scoring
- Recommendations and conditions
- Field inspections scheduling

---

### 5.4 Revenue Dashboard (`/RevenueDashboard`)

**Purpose:** Revenue collection and fee management

**Key Features:**
- Revenue KPIs dashboard
- Fee map visualization
- Listings:
  - Intent registrations
  - Entities
  - Permits
- Collection operations:
  - Invoice management
  - Payment verification
- Outstanding payments management
- Daily operations
- Item codes management
- Reports and analytics
- Staff management (manager only)
- User guide

**Fee Calculation:**
- Activity-based fee structures
- Administration and technical fees
- Processing days calculation
- Composite fee computation

---

### 5.5 Finance Dashboard (`/FinanceDashboard`)

**Purpose:** Financial oversight and budget management

**Key Features:**
- Role-based statistics
- Budget overview (manager)
- Financial processing (officer)
- Financial analytics
- Record keeping
- Performance metrics
- Account reconciliation
- Team management (manager only)
- Report generation

---

### 5.6 Directorate Dashboard (`/directorate`)

**Purpose:** Executive oversight and strategic management

**Key Features:**
- Strategic planning tools
- Leadership functions
- Performance monitoring
- Managing Director quick access
- Approval workflow (for MD):
  - Pending approvals
  - Approved applications
  - Signature tracking
- Notifications panel
- Report generation

---

### 5.7 Managing Director Dashboard (`/managing-director-dashboard`)

**Purpose:** Comprehensive approval workflow and executive oversight

**Access:** Restricted to `staff_position = 'managing_director'` or `md@cepa.gov.pg`

**Key Features:**
- Quick stats:
  - Pending approvals
  - Requires signature
  - Approved this month
  - Pending actions
- GIS Map of approved permits
- Approval workflow management:
  - Pending approvals tab
  - Approved tab
  - All applications tab
- Listings:
  - Entities overview
  - Intent registrations
  - Permits
- Executive analytics dashboard
- AI Analytics
- Profile and settings

**Approval Actions:**
- Approve application
- Reject application
- Revoke permit
- Cancel application
- Sign letter (digital signature)

---

### 5.8 Super Admin Dashboard (`/super-admin`)

**Purpose:** Complete system administration and database management

**Access:** Restricted to `user_type = 'super_admin'`

**Key Features:**
- System statistics:
  - Database tables (45+)
  - System enums (3)
  - User management
  - System health status
- Access control overview
- Database modules overview
- User management panel
- Table management panel
- Enum management panel
- System configuration

---

### 5.9 Additional Admin Pages

| Route | Purpose |
|-------|---------|
| `/admin` | Admin dashboard |
| `/system-health` | System health monitoring |
| `/security-dashboard` | Security monitoring |
| `/audit-logs` | Audit log viewer |
| `/database-administration` | Database operations |
| `/user-management` | User administration |

---

## 6. Application Workflow

### 6.1 High-Level Process Flow

```
┌─────────────────┐
│  1. Entity      │
│  Registration   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. Intent      │
│  Registration   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  3. Registry    │────▶│  Clarification  │
│     Review      │◀────│    (if needed)  │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  4. Compliance  │────▶│  Clarification  │
│    Assessment   │◀────│    (if needed)  │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  5. Revenue     │
│  Processing     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  6. Payment     │
│  Confirmation   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  7. Director    │
│    Approval     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  8. Permit      │
│    Issued       │
└─────────────────┘
```

### 6.2 Workflow Stages (Enum: `workflow_stage`)

| Stage | Description |
|-------|-------------|
| `submitted` | Application submitted by applicant |
| `registry_review` | Under review by Registry unit |
| `registry_clarification_needed` | Clarification requested from applicant |
| `compliance_review` | Under technical assessment by Compliance |
| `compliance_clarification_needed` | Technical clarification required |
| `revenue_review` | Fee calculation and invoicing |
| `revenue_invoice_issued` | Invoice generated and sent |
| `payment_pending` | Awaiting payment |
| `payment_confirmed` | Payment received and verified |
| `director_review` | Awaiting MD approval |
| `approved` | Application approved |
| `rejected` | Application rejected |
| `cancelled` | Application cancelled |

### 6.3 Application Types (Enum: `application_category`)

| Category | Description |
|----------|-------------|
| `intent_registration` | Initial intent to conduct environmental activity |
| `new_permit` | New environmental permit application |
| `permit_renewal` | Renewal of existing permit |
| `permit_amendment` | Modification to existing permit |
| `permit_transfer` | Transfer permit to new entity |
| `permit_surrender` | Voluntary surrender of permit |
| `permit_amalgamation` | Combine multiple permits |
| `compliance_report` | Compliance monitoring report |
| `enforcement_action` | Enforcement and penalty actions |

### 6.4 Workflow Features

- **Record Locking:** Prevents concurrent edits during review
- **Audit Trail:** Complete history of all workflow transitions
- **Notifications:** Automated notifications at each stage
- **SLA Tracking:** Deadline monitoring and alerts
- **Document Attachments:** Support for file uploads at each stage

---

## 7. Core Features

### 7.1 Entity Management

- Register individuals, companies, or organizations
- Store contact details, registration numbers, tax information
- Link entities to permit applications
- Entity suspension capability
- Province and district tracking

### 7.2 Intent Registration

- Project description and timeline
- Activity classification (Level 1, 2, 3)
- GIS boundary mapping
- Estimated cost tracking
- Landowner negotiation status
- Supporting document uploads
- Draft saving capability

### 7.3 Permit Application

**Comprehensive multi-step form covering:**
- Entity selection
- Activity classification
- Project details
- GIS site mapping
- Environmental impact information
- Fee calculation
- Document uploads
- Declaration and submission

**Permit Types Supported:**
- Environmental permits
- Water use permits
- Waste discharge permits
- Air emission permits
- Hazardous waste permits
- Mining permits
- Aquaculture permits
- Carbon offset permits
- Biodiversity/ABS permits

### 7.4 Fee Calculation

- Activity-based fee structures
- Administration and technical fee components
- Processing days estimation
- Fee source tracking (official/estimated)
- Multiple calculation methods
- Fee audit trail

### 7.5 GIS Mapping

- Interactive Mapbox GL integration
- Project boundary drawing tools
- GIS file upload support:
  - GeoJSON (.geojson)
  - KML/KMZ (.kml, .kmz)
  - Shapefile (.zip)
  - GPX (.gpx)
  - CSV with coordinates
- Area calculation
- Province/district layer overlays
- Protected areas visualization
- Approved permits map view

### 7.6 Document Management

- File upload and storage
- Document categorization
- Template downloads
- Version tracking
- Required document checklists
- Document viewer

### 7.7 Notification System

- Real-time notifications
- Unit-based notifications
- Manager notifications
- Directorate notifications
- Email notification support (configurable)
- Notification center UI

### 7.8 Reporting & Analytics

- Dashboard KPIs
- Custom report generation
- Excel/PDF export
- Analytics dashboards
- AI-powered analytics (MD dashboard)
- Historical trend analysis

### 7.9 Inspections Management

- Inspection scheduling
- Inspector assignment
- Inspection reports
- Travel cost tracking
- Findings documentation

### 7.10 Compliance Monitoring

- Compliance assessments
- Compliance scoring
- Violation tracking
- Enforcement actions
- Compliance reports submission

---

## 8. Database Architecture

### 8.1 Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profile information |
| `entities` | Registered companies/individuals |
| `permit_applications` | All permit applications |
| `intent_registrations` | Intent registration records |
| `intent_registration_drafts` | Draft intent registrations |
| `documents` | Uploaded documents |
| `invoices` | Generated invoices |
| `fee_payments` | Payment records |

### 8.2 Workflow Tables

| Table | Purpose |
|-------|---------|
| `application_workflow_state` | Current workflow status |
| `workflow_transitions` | Workflow audit trail |
| `approval_stages` | Approval pipeline stages |
| `workflow_fees` | Fee tracking per workflow |
| `director_approvals` | MD approval records |
| `directorate_approvals` | Directorate approval records |

### 8.3 Reference Tables

| Table | Purpose |
|-------|---------|
| `prescribed_activities` | Activity types and classifications |
| `fee_structures` | Fee calculation rules |
| `fee_calculation_methods` | Calculation formulas |
| `required_documents` | Document requirements |
| `activity_document_mapping` | Activity-document relationships |
| `activity_levels` | Level 1, 2, 3 definitions |

### 8.4 Operational Tables

| Table | Purpose |
|-------|---------|
| `inspections` | Inspection records |
| `compliance_assessments` | Assessment results |
| `compliance_reports` | Compliance submissions |
| `compliance_tasks` | Task assignments |
| `notifications` | User notifications |
| `manager_notifications` | Manager-level notifications |
| `unified_notifications` | Consolidated notification system |
| `audit_logs` | System audit trail |

### 8.5 Security

- Row Level Security (RLS) enabled on all tables
- Role-based access policies
- User-scoped data access
- Audit logging for sensitive operations

---

## 9. Security & Compliance

### 9.1 Authentication

- Supabase Auth integration
- Email/password authentication
- Password reset functionality
- Session management

### 9.2 Authorization

- Role-based access control (RBAC)
- Route-level protection
- Component-level access checks
- Unit and position-based permissions

### 9.3 Data Protection

- Row Level Security (RLS) policies
- User-scoped data access
- Secure file storage
- HTTPS encryption

### 9.4 Audit & Compliance

- Comprehensive audit logging
- Workflow transition tracking
- Document version history
- User action tracking

---

## 10. Current Development Status

### 10.1 Completed Features ✅

| Module | Status | Notes |
|--------|--------|-------|
| User Authentication | ✅ Complete | Login, registration, password reset |
| Public Dashboard | ✅ Complete | Full applicant portal |
| Entity Management | ✅ Complete | Registration and management |
| Intent Registration | ✅ Complete | Draft saving, submission |
| Permit Application Form | ✅ Complete | Multi-step comprehensive form |
| Registry Dashboard | ✅ Complete | Full review capabilities |
| Compliance Dashboard | ✅ Complete | Assessment workflow |
| Revenue Dashboard | ✅ Complete | Fee and invoice management |
| Managing Director Dashboard | ✅ Complete | Approval workflow |
| GIS Mapping | ✅ Complete | Mapbox integration |
| Document Management | ✅ Complete | Upload and categorization |
| Notification System | ✅ Complete | Multi-channel notifications |
| Fee Calculation | ✅ Complete | Activity-based calculation |
| Workflow System | ✅ Complete | Multi-stage processing |
| Reporting | ✅ Complete | Basic reports and exports |
| Super Admin Panel | ✅ Complete | System administration |

### 10.2 In Progress 🔄

| Feature | Status | Notes |
|---------|--------|-------|
| AI Analytics | 🔄 Partial | Basic implementation, enhancement needed |
| DocuSign Integration | 🔄 Planned | Digital signature support |
| Email Notifications | 🔄 Partial | Backend edge function needed |
| Mobile Optimization | 🔄 Ongoing | Responsive design improvements |

### 10.3 Planned Features 📋

| Feature | Priority | Description |
|---------|----------|-------------|
| SMS Notifications | Medium | Mobile notification support |
| Payment Gateway | High | Online payment integration |
| Advanced Analytics | Medium | BI dashboard with trends |
| Public Portal | Low | Information-only public site |
| API Documentation | Medium | Developer documentation |

---

## 11. Known Limitations

### 11.1 Technical Limitations

1. **No Offline Mode:** System requires internet connectivity
2. **Browser Compatibility:** Optimized for modern browsers (Chrome, Firefox, Edge, Safari)
3. **File Size Limits:** Document uploads limited by Supabase storage configuration
4. **Real-time Updates:** Some features require manual refresh

### 11.2 Functional Limitations

1. **Payment Processing:** Currently manual verification; no online payment gateway
2. **Digital Signatures:** DocuSign integration not yet implemented
3. **Email Delivery:** Email notifications require edge function deployment
4. **Mobile App:** No native mobile application; web-only interface

### 11.3 Data Limitations

1. **Historical Data:** Migration of historical records not yet completed
2. **GIS Data:** Limited to user-provided boundaries; no automated parcel data
3. **Integration:** No integration with external government systems

---

## 12. Recommendations & Next Steps

### 12.1 Immediate Priorities (0-3 months)

1. **Payment Gateway Integration**
   - Integrate with BPNG or commercial payment provider
   - Enable online fee payment
   - Automated payment verification

2. **Email Notification System**
   - Deploy edge functions for email delivery
   - Configure SMTP or email service provider
   - Template-based email notifications

3. **DocuSign Integration**
   - Enable digital signature for MD approvals
   - Automated letter generation and signing
   - Signed document storage

4. **User Training**
   - Develop comprehensive training materials
   - Conduct staff training sessions
   - Create video tutorials for applicants

### 12.2 Short-term Goals (3-6 months)

1. **Mobile Optimization**
   - Improve responsive design
   - Optimize for low-bandwidth connections
   - Consider Progressive Web App (PWA)

2. **Advanced Reporting**
   - Custom report builder
   - Scheduled report generation
   - Executive dashboard enhancements

3. **Integration APIs**
   - Develop REST API for external systems
   - Integration with government registries
   - Data exchange protocols

### 12.3 Long-term Vision (6-12 months)

1. **AI/ML Enhancements**
   - Automated risk assessment
   - Predictive compliance analytics
   - Natural language processing for documents

2. **Public Information Portal**
   - Public permit register
   - Environmental impact search
   - Transparency dashboard

3. **Mobile Application**
   - Native mobile apps for inspectors
   - Offline data collection
   - GPS-enabled field work

4. **System Scalability**
   - Performance optimization
   - Database partitioning
   - CDN for static assets

---

## Appendix A: Contact Information

**CEPA ICT Support:**
- Email: ict@cepa.gov.pg
- Phone: +675 301 4500

**CEPA Permits Office:**
- Email: permits@cepa.gov.pg
- Phone: +675 301 4500

**Office Hours:** Monday to Friday, 8:00 AM - 4:00 PM (PNG Time)

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| CEPA | Conservation and Environment Protection Authority |
| EIA | Environmental Impact Assessment |
| EIS | Environmental Impact Statement |
| GIS | Geographic Information System |
| KPI | Key Performance Indicator |
| MD | Managing Director |
| PNG | Papua New Guinea |
| RLS | Row Level Security |
| SLA | Service Level Agreement |

---

## Appendix C: Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 31, 2024 | System Generated | Initial comprehensive report |

---

*This document is auto-generated from the CEPA e-Permitting System codebase and reflects the current state of development as of the report date.*
