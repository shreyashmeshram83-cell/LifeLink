# 🚀 Quick Start Guide\n\n**Get LifeLink Running in 30 Minutes**\n\nFollow these steps in order to go from zero to a fully functional enterprise blood donation system.\n\n## Table of Contents\n\n- [Pre-Requisites](#pre-requisites-check-5-minutes)\n- [Supabase Setup](#step-1-setup-supabase-5-minutes)\n- [Backend Setup](#step-2-setup-backend-5-minutes)\n- [Database Setup](#step-3-setup-database-schema-5-minutes)\n- [Seed Data](#step-4-seed-sample-data-3-minutes)\n- [Frontend Setup](#step-5-start-frontend-2-minutes)\n- [Testing](#step-6-test-everything-3-minutes)\n- [What's Next](#whats-next)\n- [Troubleshooting](#troubleshooting)\n\n## ✅ Pre-Requisites Check (5 minutes)

Before starting, ensure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm 9+ installed (`npm --version`)
- [ ] Git installed (`git --version`)
- [ ] A text editor or IDE (VS Code recommended)
- [ ] Internet connection (for Supabase)
- [ ] ~500MB free disk space

---

## ✅ Step 1: Setup Supabase (5 minutes)

**What you're doing**: Creating a cloud PostgreSQL database to store all data.

1. [ ] Go to https://supabase.com
2. [ ] Click "Start your project"
3. [ ] Sign up (email/GitHub)
4. [ ] Create new project
   - Name: `lifelink`
   - Region: Choose closest to you
   - Password: Create strong password
5. [ ] Wait for database to initialize (2-3 mins)
6. [ ] Go to Settings → Database → Connection string
7. [ ] Copy the "URI" format: `postgresql://postgres:PASS@HOST:5432/postgres`
8. [ ] Keep this page open - you'll need it in Step 2

**Result**: You should have a Supabase project URL and connection string.

---

## ✅ Step 2: Setup Backend (5 minutes)

**What you're doing**: Setting up the Node.js API server.

1. [ ] Open terminal in project root
2. [ ] Navigate to backend:
   ```bash
   cd backend
   ```

3. [ ] Copy environment template:
   ```bash
   cp .env.example .env
   ```

4. [ ] Edit `.env` file with Supabase credentials:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   JWT_SECRET=your-super-secret-key-change-this
   PORT=3001
   NODE_ENV=development
   ```

   **Where to find these**:
   - SUPABASE_URL: Supabase Dashboard → Settings → API
   - SUPABASE_ANON_KEY: Supabase Dashboard → Settings → API (anon/public)
   - SUPABASE_SERVICE_KEY: Supabase Dashboard → Settings → API (service_role)

5. [ ] Install dependencies:
   ```bash
   npm install
   ```

6. [ ] Start backend:
   ```bash
   npm run dev
   ```

   **You should see**:
   ```
   Server running on http://localhost:3001
   ```

7. [ ] Keep this terminal open ✅

**Result**: Backend API running on http://localhost:3001

---

## ✅ Step 3: Setup Database Schema (5 minutes)

**What you're doing**: Creating all database tables and indexes.

1. [ ] Go to Supabase Dashboard
2. [ ] Click on "SQL Editor"
3. [ ] Click "New Query"
4. [ ] Open file: `backend/src/db/migration.sql`
5. [ ] Copy the entire content
6. [ ] Paste into Supabase SQL Editor
7. [ ] Click "Run" (or Ctrl+Enter)
8. [ ] Wait for completion - you should see:
   ```
   Query executed successfully
   ```

**Verify**:
- Go to "Table Editor"
- You should see 8 tables:
  - [ ] users
  - [ ] donors
  - [ ] hospitals
  - [ ] blood_inventory
  - [ ] emergency_requests
  - [ ] donation_records
  - [ ] notifications
  - [ ] audit_logs

**Result**: Database schema created with all tables and indexes.

---

## ✅ Step 4: Seed Sample Data (3 minutes)

**What you're doing**: Populating database with 25 hospitals and 30 donors.

1. [ ] Open new terminal (keep backend running)
2. [ ] Run seed commands:
   ```bash
   # Seed hospitals
   curl -X POST http://localhost:3001/api/seed/seed-hospitals

   # Seed donors
   curl -X POST http://localhost:3001/api/seed/seed-donors

   # Seed inventory
   curl -X POST http://localhost:3001/api/seed/seed-inventory
   ```

3. [ ] Wait for each to complete (~30 seconds each)

**Verify**: Go to Supabase Dashboard → Table Editor
- [ ] "hospitals" table has 25+ rows
- [ ] "donors" table has 30+ rows  
- [ ] "blood_inventory" table has 100+ rows

**Result**: Sample data loaded in database.

---

## ✅ Step 5: Start Frontend (2 minutes)

**What you're doing**: Starting the React development server.

1. [ ] Open new terminal (in project root)
2. [ ] Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. [ ] Edit `.env`:
   ```
   VITE_API_URL=http://localhost:3001/api
   ```

4. [ ] Install dependencies:
   ```bash
   npm install
   ```

5. [ ] Start frontend:
   ```bash
   npm run dev
   ```

   **You should see**:
   ```
   VITE v5.x.x  ready in 234 ms
   Local: http://localhost:5173/
   ```

6. [ ] Keep this terminal open ✅

**Result**: Frontend running on http://localhost:5173

---

## ✅ Step 6: Test Everything (3 minutes)

**What you're doing**: Verifying all components are working.

1. [ ] Open browser: http://localhost:5173
2. [ ] You should see LifeLink landing page

3. [ ] Test signup:
   ```
   Email: test@example.com
   Password: test123
   Phone: +91-9876543210
   Role: donor
   Click Sign Up
   ```

4. [ ] Test login with those credentials

5. [ ] Verify API calls working:
   - [ ] Browse donors page - should show 30+ seeded donors
   - [ ] Create emergency request - should generate ID like "LL-2026-XXXX"
   - [ ] Check inventory - should show blood stocks

**Result**: All systems working! ✅

---

## 🎉 Success! You're Done

You now have a **fully functional enterprise blood donation system** with:

- ✅ Backend API (40+ endpoints)
- ✅ PostgreSQL Database (8 tables, 150+ sample records)
- ✅ React Frontend (all pages connected)
- ✅ JWT Authentication
- ✅ Real-time Inventory Management
- ✅ Donor Matching Algorithm
- ✅ Emergency Request Tracking

---

## 📊 System Status Check

After 30 minutes, you should have:

| Component | URL | Expected |
|-----------|-----|----------|
| Frontend | http://localhost:5173 | ✅ Loading |
| Backend API | http://localhost:3001 | ✅ Running |
| Database | Supabase Dashboard | ✅ 8 tables |
| Sample Data | Table Editor | ✅ 150+ records |

---

## 🚀 What's Next?

### Immediate (Next 1-2 Hours)
1. [ ] Update React components to use real API (see MIGRATION_GUIDE.md)
2. [ ] Test all features end-to-end
3. [ ] Fix any bugs found

### This Week
1. [ ] Deploy backend to Railway or Render
2. [ ] Deploy frontend to Vercel
3. [ ] Set production environment variables
4. [ ] Test production endpoints

### Next Week
1. [ ] Add SMS notifications (Twilio)
2. [ ] Implement real-time WebSocket updates
3. [ ] Add 2FA for admin users
4. [ ] Security audit

---

## 🆘 Troubleshooting

### "Port 3001 already in use"
```bash
# Find and kill process
lsof -ti :3001 | xargs kill -9
# Then restart backend
npm run dev
```

### "Cannot connect to database"
```bash
# Check Supabase credentials in backend/.env
# Verify SUPABASE_URL and SUPABASE_ANON_KEY
# Go to Supabase Dashboard → Settings → API to confirm values
```

### "Frontend not loading"
```bash
# Check Vite is running
# Check frontend/.env has VITE_API_URL=http://localhost:3001/api
# Clear browser cache: Ctrl+Shift+Delete
```

### "API endpoints returning 404"
```bash
# Verify backend is running on :3001
# Check API_BASE_URL in src/lib/api.ts
# Test with curl: curl http://localhost:3001/api/
```

### "Seed data not appearing"
```bash
# Verify database schema created:
# - Go to Supabase Table Editor
# - Check all 8 tables exist
# - Run seed commands again: curl -X POST http://localhost:3001/api/seed/seed-hospitals
```

---

## 📞 Terminal Sessions Needed

After startup, you should have **3 terminals open**:

```
Terminal 1: Backend
$ cd backend && npm run dev
→ Running on http://localhost:3001

Terminal 2: Frontend
$ npm run dev
→ Running on http://localhost:5173

Terminal 3: Supabase Dashboard
→ https://supabase.com/dashboard
```

---

## 📚 Documentation to Read Next

After running locally, read these in order:

1. **API_REFERENCE.md** (15 mins)
   - All 40+ endpoint examples
   - Curl examples for testing
   - Error codes and handling

2. **MIGRATION_GUIDE.md** (20 mins)
   - How to update React components
   - Code examples (before/after)
   - Loading states and error handling

3. **ENTERPRISE_ARCHITECTURE.md** (20 mins)
   - System design decisions
   - Database schema explanation
   - Scalability considerations

---

## ✨ Key Files to Remember

```
Project Root
├── backend/                    # Node.js/Express API
├── src/                        # React Frontend
├── SETUP_GUIDE.md             # Detailed setup help
├── API_REFERENCE.md           # API endpoint docs
├── MIGRATION_GUIDE.md         # Frontend integration
├── ENTERPRISE_ARCHITECTURE.md # System design
└── README.md                  # Project overview
```

---

## 🎯 Estimated Timeline

| Step | Time | Status |
|------|------|--------|
| 1. Supabase Setup | 5 mins | ✅ |
| 2. Backend Setup | 5 mins | ✅ |
| 3. Database Schema | 5 mins | ✅ |
| 4. Seed Data | 3 mins | ✅ |
| 5. Frontend Setup | 2 mins | ✅ |
| 6. Testing | 3 mins | ✅ |
| **Total** | **~30 mins** | ✅ |

---

## 🎉 You Did It!

Your LifeLink enterprise system is now:
- ✅ **Running locally**
- ✅ **Connected to real database**
- ✅ **Populated with sample data**
- ✅ **Ready for customization**
- ✅ **Ready for production deployment**

### Next command to run:
```bash
# Open browser and navigate to:
http://localhost:5173
```

---

**Questions? Check:**
- Setup issues → SETUP_GUIDE.md
- API usage → API_REFERENCE.md
- Frontend integration → MIGRATION_GUIDE.md
- Architecture → ENTERPRISE_ARCHITECTURE.md

**Happy coding! 🚀**
