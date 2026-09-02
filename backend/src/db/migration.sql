# PostgreSQL Database Migration for LifeLink Enterprise

## Tables Creation Script

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- USERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('donor', 'hospital_staff', 'admin', 'patient')),
  verified BOOLEAN DEFAULT FALSE,
  profile_data JSONB DEFAULT '{}',
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- DONORS TABLE
CREATE TABLE donors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blood_group TEXT NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-')),
  phone_encrypted TEXT,
  current_location GEOMETRY(POINT, 4326),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  donations_count INT DEFAULT 0,
  last_donation_date TIMESTAMP,
  eligibility_status TEXT DEFAULT 'pending' CHECK (eligibility_status IN ('eligible', 'not_eligible', 'pending')),
  reliability_score INT DEFAULT 0,
  response_rate DECIMAL(5, 2) DEFAULT 100.0,
  no_show_rate DECIMAL(5, 2) DEFAULT 0.0,
  verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_donors_blood_group ON donors(blood_group);
CREATE INDEX idx_donors_location ON donors USING GIST(current_location);
CREATE INDEX idx_donors_eligible ON donors(eligible, active);

-- HOSPITALS TABLE
CREATE TABLE hospitals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location GEOMETRY(POINT, 4326),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  address TEXT NOT NULL,
  contact_person TEXT,
  phone_encrypted TEXT,
  email TEXT,
  bed_capacity INT,
  emergency_dept BOOLEAN DEFAULT FALSE,
  blood_bank_capacity INT,
  verified BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hospitals_location ON hospitals USING GIST(location);
CREATE INDEX idx_hospitals_name ON hospitals(name);
CREATE INDEX idx_hospitals_emergency ON hospitals(emergency_dept);

-- BLOOD INVENTORY TABLE
CREATE TABLE blood_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  blood_group TEXT NOT NULL,
  units_available INT DEFAULT 0,
  units_reserved INT DEFAULT 0,
  storage_type TEXT NOT NULL,
  temperature_controlled BOOLEAN DEFAULT TRUE,
  expiry_date TIMESTAMP,
  last_updated TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_inventory_hospital ON blood_inventory(hospital_id);
CREATE INDEX idx_inventory_blood_group ON blood_inventory(blood_group);

-- EMERGENCY REQUESTS TABLE
CREATE TABLE emergency_requests (
  id TEXT PRIMARY KEY,
  patient_id UUID REFERENCES users(id),
  hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  blood_group TEXT NOT NULL,
  component TEXT NOT NULL,
  units_required INT NOT NULL,
  urgency TEXT NOT NULL CHECK (urgency IN ('Critical', 'Urgent', 'Normal')),
  status TEXT NOT NULL DEFAULT 'VERIFYING' CHECK (status IN ('VERIFYING', 'VERIFIED', 'MATCHING', 'DONORS_NOTIFIED', 'DONOR_RESPONDING', 'FULFILLED', 'CANCELLED')),
  contact_number_encrypted TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  fulfilled_at TIMESTAMP,
  fulfilled_by_donor_id UUID REFERENCES donors(id),
  notes TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_requests_status ON emergency_requests(status);
CREATE INDEX idx_requests_blood_group ON emergency_requests(blood_group);
CREATE INDEX idx_requests_hospital ON emergency_requests(hospital_id);
CREATE INDEX idx_requests_created ON emergency_requests(created_at DESC);

-- DONATION RECORDS TABLE
CREATE TABLE donation_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL REFERENCES emergency_requests(id),
  hospital_id UUID NOT NULL REFERENCES hospitals(id),
  blood_group TEXT NOT NULL,
  units_donated INT NOT NULL,
  donation_date TIMESTAMP DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('completed', 'pending', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_donations_donor ON donation_records(donor_id);
CREATE INDEX idx_donations_request ON donation_records(request_id);

-- NOTIFICATIONS TABLE
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES donors(id) ON DELETE CASCADE,
  request_id TEXT NOT NULL REFERENCES emergency_requests(id),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('sms', 'whatsapp', 'push', 'in_app')),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  response TEXT CHECK (response IN ('accepted', 'declined', 'no_response'))
);

CREATE INDEX idx_notifications_donor ON notifications(donor_id);
CREATE INDEX idx_notifications_request ON notifications(request_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
```

## Run this migration in Supabase SQL Editor

1. Go to Supabase Dashboard
2. Open SQL Editor
3. Copy and paste the SQL above
4. Click "Run"
5. Verify all tables are created
