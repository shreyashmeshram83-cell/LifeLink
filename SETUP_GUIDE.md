# LifeLink Setup Guide

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

### 3. Setup Supabase Database
1. Go to [Supabase.com](https://supabase.com)
2. Create a new project
3. Copy the URL and Anon Key to `.env`
4. Go to SQL Editor and run `src/db/migration.sql`

### 4. Seed Sample Data
```bash
# Start backend
npm run dev

# In another terminal, run seed:
curl -X POST http://localhost:3001/api/seed/seed-hospitals
curl -X POST http://localhost:3001/api/seed/seed-donors
curl -X POST http://localhost:3001/api/seed/seed-inventory
```

### 5. Start Backend
```bash
npm run dev
```
Backend runs on `http://localhost:3001`

---

## Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Update VITE_API_URL if backend is on different port
```

### 3. Start Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## Production Deployment

### Backend Deployment (Railway/Render)
1. Push code to GitHub
2. Connect repo to Railway/Render
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)
1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy automatically

---

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication
All requests (except signup/login) require JWT token in header:
```
Authorization: Bearer {token}
```

### Endpoints

#### Auth
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user

#### Donors
- `GET /donors` - List donors
- `GET /donors/:id` - Get donor details
- `POST /donors` - Register donor
- `PUT /donors/:id/availability` - Update availability

#### Hospitals
- `GET /hospitals` - List hospitals
- `GET /hospitals/:id` - Get hospital details
- `GET /hospitals/:id/inventory` - Get inventory

#### Requests
- `GET /requests` - List requests
- `POST /requests` - Create request
- `GET /requests/:id` - Get request details
- `PUT /requests/:id/status` - Update status
- `GET /requests/:id/matched-donors` - Get matched donors

#### Inventory
- `GET /inventory` - List all inventory
- `GET /inventory/hospital/:id` - Get hospital inventory
- `PUT /inventory/:id` - Update stock
- `POST /inventory/reserve` - Reserve units

#### Analytics
- `GET /analytics/dashboard` - Dashboard stats
- `GET /analytics/donors` - Donor metrics
- `GET /analytics/requests` - Request metrics

---

## Features Implemented

### ✅ Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (donor, hospital, admin, patient)

### ✅ Donor Management
- Donor registration with blood group
- Availability tracking
- Donation history
- Reliability scoring
- Geolocation support

### ✅ Hospital Management
- Hospital registration and verification
- Blood inventory management
- Emergency request handling
- Real-time status updates

### ✅ Emergency Requests
- Request creation with validation
- AI-powered donor matching
- Status tracking (VERIFYING → VERIFIED → MATCHING → DONORS_NOTIFIED → FULFILLED)
- Notification system

### ✅ Blood Inventory
- Real-time stock tracking
- Reservation system
- Expiry date management
- Multi-storage type support

### ✅ Analytics
- Dashboard statistics
- Donor metrics
- Request fulfillment rates
- Inventory health

### ✅ Security
- PII encryption
- JWT authentication
- Rate limiting
- HIPAA-compliant audit logging
- Input validation and sanitization

---

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify Supabase credentials
- Check `.env` file is properly configured

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors

### Database errors
- Verify all tables are created (run migration.sql again)
- Check Supabase connection
- Verify database credentials

### Seed data not loading
- Ensure backend is running
- Check that hospitals table exists
- Verify Supabase credentials are correct

---

## Testing

### Test Signup
```bash
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Donor List
```bash
curl http://localhost:3001/api/donors
```

### Test Hospital List
```bash
curl http://localhost:3001/api/hospitals
```

---

## Support

For issues or questions, refer to:
- Supabase Docs: https://supabase.com/docs
- Express.js Docs: https://expressjs.com/
- React Docs: https://react.dev/
