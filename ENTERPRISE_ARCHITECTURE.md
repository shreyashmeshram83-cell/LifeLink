# LifeLink Enterprise Architecture

## System Overview

```
Frontend (React)           Backend (Express)          Database (Supabase)
━━━━━━━━━━━━━━━          ━━━━━━━━━━━━━━━━━━━         ━━━━━━━━━━━━━━━━━━
├─ DonorDashboard    ───→ ├─ /api/donors      ──────→ donors table
├─ HospitalDashboard ───→ ├─ /api/hospitals   ──────→ hospitals table
├─ RequestForm       ───→ ├─ /api/requests    ──────→ emergency_requests table
├─ Admin Dashboard   ───→ ├─ /api/auth        ──────→ users table
└─ AI Matching      ───→ ├─ /api/inventory   ──────→ blood_inventory table
                          ├─ /api/analytics   ──────→ donation_records table
                          └─ Auth Middleware   ──────→ JWT tokens
```

## Database Schema

### Core Tables

#### 1. users
- id (UUID, PK)
- email (UNIQUE)
- phone (UNIQUE)
- password_hash (bcrypt)
- role (donor | hospital_staff | admin | patient)
- verified (boolean)
- profile_data (JSONB)
- created_at, updated_at

#### 2. donors
- id (UUID, PK)
- user_id (FK → users)
- blood_group (A+ | A- | B+ | B- | O+ | O- | AB+ | AB-)
- phone (encrypted)
- current_location (geometry point)
- lat, lng (decimal)
- donations_count (integer)
- last_donation_date (timestamp)
- eligibility_status (eligible | not_eligible | pending)
- reliability_score (0-100)
- response_rate (%)
- no_show_rate (%)
- verified (boolean)
- active (boolean)
- created_at, updated_at

#### 3. hospitals
- id (UUID, PK)
- user_id (FK → users)
- name (text)
- location (geometry point)
- lat, lng (decimal)
- address (text)
- contact_person (text)
- phone (encrypted)
- email (text)
- bed_capacity (integer)
- emergency_dept (boolean)
- blood_bank_capacity (integer)
- verified (boolean)
- active (boolean)
- created_at, updated_at

#### 4. blood_inventory
- id (UUID, PK)
- hospital_id (FK → hospitals)
- blood_group (text)
- units_available (integer)
- units_reserved (integer)
- storage_type (Whole Blood | RBC | Platelets | Plasma)
- temperature_controlled (boolean)
- expiry_date (timestamp)
- last_updated (timestamp)

#### 5. emergency_requests
- id (TEXT, PK: LL-YYYY-XXXX)
- patient_id (FK → users, nullable)
- hospital_id (FK → hospitals)
- patient_name (text)
- blood_group (text)
- component (Whole Blood | RBC | Platelets | Plasma)
- units_required (integer)
- urgency (Critical | Urgent | Normal)
- status (VERIFYING | VERIFIED | MATCHING | DONORS_NOTIFIED | DONOR_RESPONDING | FULFILLED | CANCELLED)
- contact_number (encrypted)
- created_at (timestamp)
- fulfilled_at (timestamp, nullable)
- fulfilled_by_donor_id (FK → donors, nullable)
- notes (text)

#### 6. donation_records
- id (UUID, PK)
- donor_id (FK → donors)
- request_id (FK → emergency_requests)
- hospital_id (FK → hospitals)
- blood_group (text)
- units_donated (integer)
- donation_date (timestamp)
- status (completed | pending | cancelled)
- created_at

#### 7. notifications
- id (UUID, PK)
- donor_id (FK → donors)
- request_id (FK → emergency_requests)
- notification_type (sms | whatsapp | push | in_app)
- status (sent | delivered | read | failed)
- sent_at (timestamp)
- read_at (timestamp, nullable)
- response (accepted | declined | no_response)

#### 8. audit_logs
- id (UUID, PK)
- user_id (FK → users)
- action (CREATE | UPDATE | DELETE | VIEW)
- resource_type (donor | hospital | request | inventory)
- resource_id (text)
- old_value (JSONB)
- new_value (JSONB)
- ip_address (text)
- timestamp (timestamp)

## API Endpoints

### Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token
- POST /api/auth/reset-password

### Donors
- GET /api/donors (list with filters)
- GET /api/donors/:id
- POST /api/donors (register new donor)
- PUT /api/donors/:id (update profile)
- PUT /api/donors/:id/availability (update availability)
- GET /api/donors/:id/donation-history

### Hospitals
- GET /api/hospitals (list)
- GET /api/hospitals/:id
- POST /api/hospitals (register new hospital)
- PUT /api/hospitals/:id (update info)
- GET /api/hospitals/:id/inventory

### Emergency Requests
- GET /api/requests (list)
- POST /api/requests (create new request)
- GET /api/requests/:id
- PUT /api/requests/:id/status (update status)
- POST /api/requests/:id/match-donors (trigger matching)
- GET /api/requests/:id/matched-donors

### Blood Inventory
- GET /api/inventory (across all hospitals)
- GET /api/inventory/hospital/:id
- PUT /api/inventory/:id (update stock)
- POST /api/inventory/reserve (reserve blood)
- POST /api/inventory/release (release reservation)

### Analytics
- GET /api/analytics/dashboard (overall stats)
- GET /api/analytics/donors (donor metrics)
- GET /api/analytics/requests (request fulfillment rates)
- GET /api/analytics/inventory (blood availability)

### Admin
- GET /api/admin/users (list all users)
- PUT /api/admin/users/:id/verify (verify user)
- DELETE /api/admin/users/:id
- GET /api/admin/audit-logs
- GET /api/admin/system-health

## Security Implementation

### 1. Authentication & Authorization
- JWT tokens (access + refresh)
- Role-based access control (RBAC)
- 2FA for admin users
- Session management

### 2. Data Protection
- PII encryption (bcrypt for passwords, AES for phone/contact)
- Database-level encryption
- HTTPS/TLS for all API calls
- Audit logging for all actions

### 3. Validation & Sanitization
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens

### 4. Rate Limiting
- 100 requests per minute per user
- 1000 requests per minute per IP
- Endpoint-specific limits for sensitive operations

### 5. HIPAA Compliance
- Audit trail for all patient data access
- Encryption at rest and in transit
- Access controls and role separation
- Data retention policies

## Real-time Features

### WebSocket Events
- new-request → Broadcast to all eligible donors
- donor-response → Update hospital dashboard
- inventory-update → Notify all hospitals
- status-change → Notify patient and hospital

## Deployment

### Frontend
- Vercel (automatic deployments from main branch)

### Backend
- Railway / Render (Node.js hosting)
- Environment variables for secrets

### Database
- Supabase (managed PostgreSQL)
- Automated backups
- Point-in-time recovery

### Monitoring
- Sentry (error tracking)
- LogRocket (session replay)
- DataDog (performance metrics)
