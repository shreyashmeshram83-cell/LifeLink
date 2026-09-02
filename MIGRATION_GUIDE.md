# Frontend Migration Guide

## From Mock Data to Real Backend API

This guide explains how to transition from the mock data frontend to using the real backend API.

### Changes Summary

| Aspect | Before (Mock) | After (Real API) |
|--------|---------------|-----------------|
| **Data Storage** | React Context + Local Memory | PostgreSQL Database |
| **State Management** | Mock data in memory | API calls with loading states |
| **Authentication** | Demo roles (patient, hospital, donor) | JWT tokens + real authentication |
| **Persistence** | Lost on page refresh | Persistent in database |
| **Real-time** | Animated simulations | Live WebSocket updates |
| **Users** | All users access same demo data | Role-based access control |

### Step 1: Environment Setup

Create `.env` file:
```bash
cp .env.example .env
```

Configure with your backend URL:
```
VITE_API_URL=http://localhost:3001/api
VITE_ENABLE_REAL_TIME_TRACKING=true
VITE_ENABLE_SMS_NOTIFICATIONS=true
```

### Step 2: API Client Integration

The API client (`src/lib/api.ts`) provides all backend communication:

```typescript
import { api } from '@/lib/api';

// Signup
const result = await api.signup('user@example.com', 'password', '+91-XXXXXXXXXX', 'donor');

// Login
const result = await api.login('user@example.com', 'password');

// Get donors
const donors = await api.getDonors({ blood_group: 'O+', available: true });

// Create emergency request
const request = await api.createRequest({
  patient_name: 'Suresh Kumar',
  blood_group: 'B+',
  component: 'Whole Blood',
  units_required: 2,
  urgency: 'Critical',
  hospital_id: 'h001',
  contact_number: '+91-98450-12345'
});
```

### Step 3: Update Components

#### Example: DonorDashboard Component

**Before (Mock Data):**
```typescript
import { useApp } from '@/context/AppContext';

export function DonorDashboard() {
  const { donors } = useApp(); // Mock data
  
  return (
    <div>
      {donors.map(donor => (
        <div key={donor.id}>{donor.name}</div>
      ))}
    </div>
  );
}
```

**After (Real API):**
```typescript
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Donor } from '@/types';

export function DonorDashboard() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const data = await api.getDonors({ available: true });
        setDonors(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {donors.map(donor => (
        <div key={donor.id}>{donor.name}</div>
      ))}
    </div>
  );
}
```

### Step 4: Update RequestForm Component

**Before (Mock):**
```typescript
const { addRequest } = useApp();

const handleSubmit = (formData) => {
  const request = {
    id: 'LL-2026-' + Math.random(),
    ...formData,
    status: 'VERIFYING',
    createdAt: Date.now()
  };
  addRequest(request);
};
```

**After (Real API):**
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (formData: any) => {
  setLoading(true);
  setError(null);
  try {
    const result = await api.createRequest({
      patient_name: formData.patientName,
      blood_group: formData.bloodGroup,
      component: formData.component,
      units_required: formData.unitsRequired,
      urgency: formData.urgency,
      hospital_id: formData.hospitalId,
      contact_number: formData.contactNumber
    });
    console.log('Request created:', result);
    // Redirect or show success
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Step 5: Update Authentication

**Before (Mock):**
```typescript
const { role, setRole } = useApp();

const handleLoginClick = () => {
  setRole('donor'); // Simulate login
};
```

**After (Real API):**
```typescript
import { useState } from 'react';
import { api } from '@/lib/api';

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);
  try {
    const { token, user } = await api.login(email, password);
    localStorage.setItem('user', JSON.stringify(user));
    // Redirect to dashboard
  } catch (err: any) {
    console.error(err.message);
  } finally {
    setLoading(false);
  }
};
```

### Step 6: Error Handling

Implement error boundaries and loading states:

```typescript
import { useEffect, useState } from 'react';

export function useAPI<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fn()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

// Usage:
const { data: donors, loading, error } = useAPI(() => api.getDonors());

if (loading) return <Spinner />;
if (error) return <Error message={error.message} />;
return <DonorList donors={donors} />;
```

### Step 7: Testing

1. **Start Backend**
   ```bash
   cd backend
   npm run dev
   ```

2. **Seed Database**
   ```bash
   curl -X POST http://localhost:3001/api/seed/seed-hospitals
   curl -X POST http://localhost:3001/api/seed/seed-donors
   curl -X POST http://localhost:3001/api/seed/seed-inventory
   ```

3. **Start Frontend**
   ```bash
   npm run dev
   ```

4. **Test Login**
   - Create new account via signup
   - Or use seeded hospital/donor accounts

### Step 8: Troubleshooting

**CORS Error**: Backend not accessible
```
Solution: Ensure backend is running on port 3001 and frontend proxy is configured
```

**401 Unauthorized**: Token not sent
```
Solution: Check localStorage has auth_token after login
```

**404 API Not Found**: Wrong endpoint
```
Solution: Verify API_BASE_URL in api.ts matches backend URL
```

**Database Error**: Can't connect to Supabase
```
Solution: Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
```

### Deprecated: Mock Data Components

These can now be removed/updated:
- `src/data/mockData.ts` - No longer needed
- Mock API calls in AppContext
- Demo role simulation

### Next Steps

1. Update all page components to use API
2. Add loading and error states
3. Implement real-time updates with WebSocket
4. Add notification system integration
5. Set up monitoring and error tracking
