# LifeLink API Quick Reference

## Base URL
```
http://localhost:3001/api
```

## Authentication
All requests (except auth endpoints) require JWT token:
```
Authorization: Bearer {token}
```

---

## Endpoints Quick Reference

### 🔐 Authentication

#### Signup
```bash
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "phone": "+91-9876543210",
  "role": "donor"  # donor | hospital_staff | patient | admin
}

Response:
{
  "message": "User created successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "donor"
  }
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": { ... }
}
```

---

### 👤 Donors

#### List Donors
```bash
GET /donors?blood_group=O+&available=true&lat=19.07&lng=72.88&radius_km=10

Response:
[
  {
    "id": "d001",
    "name": "Rajesh Kumar",
    "blood_group": "O+",
    "lat": 19.0760,
    "lng": 72.8777,
    "donations": 12,
    "eligibility_status": "eligible",
    "reliability_score": 94,
    "active": true
  },
  ...
]
```

#### Get Donor Details
```bash
GET /donors/{id}
Authorization: Bearer {token}

Response:
{ donor object }
```

#### Register Donor
```bash
POST /donors
Authorization: Bearer {token}
Content-Type: application/json

{
  "blood_group": "O+",
  "lat": 19.0760,
  "lng": 72.8777
}

Response:
{
  "message": "Donor registered successfully",
  "data": { donor object }
}
```

#### Update Availability
```bash
PUT /donors/{id}/availability
Authorization: Bearer {token}
Content-Type: application/json

{
  "active": true
}

Response:
{
  "message": "Availability updated",
  "data": { updated donor object }
}
```

#### Donation History
```bash
GET /donors/{id}/donation-history

Response:
[
  {
    "id": "uuid",
    "donor_id": "d001",
    "request_id": "LL-2026-0001",
    "units_donated": 1,
    "donation_date": "2026-09-02T10:30:00Z",
    "status": "completed"
  },
  ...
]
```

---

### 🏥 Hospitals

#### List Hospitals
```bash
GET /hospitals

Response:
[
  {
    "id": "h001",
    "name": "Apollo Hospital",
    "address": "Mumbai",
    "lat": 19.0760,
    "lng": 72.8777,
    "bed_capacity": 450,
    "emergency_dept": true,
    "verified": true,
    "active": true
  },
  ...
]
```

#### Get Hospital Details
```bash
GET /hospitals/{id}

Response:
{ hospital object }
```

#### Get Hospital Inventory
```bash
GET /hospitals/{id}/inventory

Response:
[
  {
    "id": "uuid",
    "hospital_id": "h001",
    "blood_group": "O+",
    "units_available": 45,
    "units_reserved": 5,
    "storage_type": "Whole Blood",
    "expiry_date": "2026-10-17T00:00:00Z"
  },
  ...
]
```

---

### 🆘 Emergency Requests

#### List Requests
```bash
GET /requests?status=DONORS_NOTIFIED&hospital_id=h001

Response:
[
  {
    "id": "LL-2026-0001",
    "patient_name": "Suresh Kumar",
    "blood_group": "B+",
    "component": "Whole Blood",
    "units_required": 2,
    "urgency": "Critical",
    "status": "DONORS_NOTIFIED",
    "created_at": "2026-09-02T08:15:00Z",
    "hospital_id": "h001"
  },
  ...
]
```

#### Create Emergency Request
```bash
POST /requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "patient_name": "Suresh Kumar",
  "blood_group": "B+",
  "component": "Whole Blood",
  "units_required": 2,
  "urgency": "Critical",
  "hospital_id": "h001",
  "contact_number": "+91-98450-12345"
}

Response:
{
  "message": "Emergency request created",
  "data": { request object with id: "LL-2026-XXXX" }
}
```

#### Get Request Details
```bash
GET /requests/{id}

Response:
{ request object }
```

#### Update Request Status
```bash
PUT /requests/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "FULFILLED"  # VERIFYING | VERIFIED | MATCHING | DONORS_NOTIFIED | DONOR_RESPONDING | FULFILLED | CANCELLED
}

Response:
{
  "message": "Request status updated",
  "data": { updated request object }
}
```

#### Get Matched Donors
```bash
GET /requests/{id}/matched-donors

Response:
[
  {
    "id": "d001",
    "name": "Rajesh Kumar",
    "blood_group": "O+",
    "lat": 19.0760,
    "lng": 72.8777,
    "distance": 2.4,
    "eligibility_status": "eligible",
    "reliability_score": 94
  },
  ...
]
```

---

### 📦 Blood Inventory

#### List All Inventory
```bash
GET /inventory

Response:
[
  {
    "id": "uuid",
    "hospital_id": "h001",
    "blood_group": "O+",
    "units_available": 45,
    "units_reserved": 5
  },
  ...
]
```

#### Update Inventory
```bash
PUT /inventory/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "units_available": 40,
  "units_reserved": 10
}

Response:
{
  "message": "Inventory updated",
  "data": { updated inventory object }
}
```

#### Reserve Blood Units
```bash
POST /inventory/reserve
Authorization: Bearer {token}
Content-Type: application/json

{
  "inventory_id": "uuid",
  "units": 2
}

Response:
{
  "message": "Blood units reserved",
  "data": { updated inventory object }
}
```

---

### 📊 Analytics

#### Dashboard Stats
```bash
GET /analytics/dashboard

Response:
{
  "total_requests": 156,
  "active_donors": 487,
  "active_hospitals": 25,
  "donations_today": 12
}
```

#### Donor Metrics
```bash
GET /analytics/donors

Response:
{
  "by_blood_group": {
    "O+": 125,
    "O-": 42,
    "A+": 98,
    ...
  },
  "eligible": 420,
  "ineligible": 67
}
```

#### Request Metrics
```bash
GET /analytics/requests

Response:
{
  "total": 156,
  "by_status": {
    "FULFILLED": 145,
    "DONORS_NOTIFIED": 8,
    "VERIFYING": 3
  },
  "fulfillment_rate": "92.95"
}
```

---

### ⚙️ Admin Operations

#### List All Users
```bash
GET /admin/users
Authorization: Bearer {admin_token}

Response:
[
  {
    "id": "uuid",
    "email": "user@example.com",
    "phone": "+91-XXXXXXXXXX",
    "role": "donor",
    "verified": true,
    "created_at": "2026-09-02T10:15:00Z"
  },
  ...
]
```

#### Verify User
```bash
PUT /admin/users/{id}/verify
Authorization: Bearer {admin_token}

Response:
{
  "message": "User verified",
  "data": { updated user object }
}
```

#### Get Audit Logs
```bash
GET /admin/audit-logs
Authorization: Bearer {admin_token}

Response:
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "action": "CREATE",
    "resource_type": "emergency_request",
    "resource_id": "LL-2026-0001",
    "timestamp": "2026-09-02T10:15:00Z"
  },
  ...
]
```

#### System Health
```bash
GET /admin/system-health
Authorization: Bearer {admin_token}

Response:
{
  "status": "healthy",
  "timestamp": "2026-09-02T10:15:00Z",
  "database": "connected",
  "api": "operational"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Description of what went wrong"
}
```

### Common Status Codes
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation error)
- **401**: Unauthorized (missing/invalid token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Server Error

### Example Error
```bash
curl -X GET http://localhost:3001/api/donors/invalid-id

Response (404):
{
  "error": "Donor not found"
}
```

---

## Testing with cURL

### Test Signup
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "phone": "+91-9876543210",
    "role": "donor"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test Get Donors (with token)
```bash
curl -X GET http://localhost:3001/api/donors \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Create Request
```bash
curl -X POST http://localhost:3001/api/requests \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "patient_name": "Test Patient",
    "blood_group": "O+",
    "component": "Whole Blood",
    "units_required": 2,
    "urgency": "Critical",
    "hospital_id": "h001",
    "contact_number": "+91-9876543210"
  }'
```

---

## Using the JavaScript API Client

```typescript
import { api } from '@/lib/api';

// Login
const { token, user } = await api.login('email@example.com', 'password');

// Get donors nearby
const donors = await api.getDonors({
  blood_group: 'O+',
  available: true,
  lat: 19.0760,
  lng: 72.8777,
  radius_km: 10
});

// Create emergency request
const request = await api.createRequest({
  patient_name: 'John Doe',
  blood_group: 'B+',
  component: 'Whole Blood',
  units_required: 2,
  urgency: 'Critical',
  hospital_id: 'h001',
  contact_number: '+91-9876543210'
});

// Get matched donors
const matchedDonors = await api.getMatchedDonors(request.data.id);

// Update request status
await api.updateRequestStatus(request.data.id, 'FULFILLED');

// Get analytics
const dashboard = await api.getDashboard();
```

---

## Rate Limiting

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

When limit exceeded:
```
HTTP 429 Too Many Requests
X-RateLimit-Reset: 1630675500
```

---

## Pagination (Future)

Not yet implemented. Coming soon:
```bash
GET /donors?page=1&limit=50
```

---

## Versioning

Current version: **v1**

Future versions will support:
```bash
GET /v2/donors
```

---

**API Documentation Last Updated**: 2026-09-02
