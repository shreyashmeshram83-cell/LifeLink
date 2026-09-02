# 🔥 Firebase Real-Time Database - Complete Setup Guide

## Part 1: Configure Your Firebase Project

### 1.1 Create Environment File

Copy `.env.firebase` to `.env.local` and fill in your details:

```bash
cp .env.firebase .env.local
```

**Then edit `.env.local`:**

```env
# Get these from Firebase Console → Project Settings → General tab
VITE_FIREBASE_API_KEY=AIzaSyD_your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=lifelink-abc123.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://lifelink-abc123.firebaseio.com
VITE_FIREBASE_PROJECT_ID=lifelink-abc123
VITE_FIREBASE_STORAGE_BUCKET=lifelink-abc123.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

**Where to find these in Firebase Console:**
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ **Settings** → **Project Settings**
4. Scroll down to find all these values in the **"Your apps"** section

### 1.2 Set Security Rules

**IMPORTANT: Set these in Firebase Console to protect your data!**

1. Go to **Realtime Database** → **Rules** tab
2. Copy content from `firebase-rules.json` in this repository
3. Paste into the Rules editor
4. Click **Publish**

These rules ensure:
- Only authenticated users can read data
- Only admins can modify donor/hospital data
- Only authorized roles can access sensitive data
- Emergency requests can be created by authenticated users

---

## Part 2: Add Real Data to Firebase

### Option A: Seed Data Via Admin Panel (Easiest)

1. **Login as Admin** in the app:
   - Email: `admin@lifelink.com`
   - Password: `admin123`

2. Go to **Admin Dashboard** → **Seed Data** section

3. Click **Seed Sample Data** buttons:
   - ✅ Seed 20 Donors
   - ✅ Seed 5 Hospitals
   - ✅ Seed Blood Inventory
   - ✅ Seed 3 Emergency Requests

**This will populate Firebase automatically!**

---

### Option B: Manual Import Via Firebase Console

#### Import Donors

1. Go to Firebase Console → **Realtime Database**
2. Click the 3-dot menu → **Import JSON**
3. Use this data:

```json
{
  "donors": {
    "d1": {
      "id": "d1",
      "name": "Rahul Sharma",
      "bloodGroup": "O+",
      "distanceKm": 2.4,
      "availability": "Available",
      "donations": 4,
      "reliabilityScore": 94,
      "eligible": true,
      "lastDonationMonths": 5,
      "lat": 12.9352,
      "lng": 77.6245,
      "phone": "+91-9876543210",
      "createdAt": 1704067200000
    },
    "d2": {
      "id": "d2",
      "name": "Aisha Khan",
      "bloodGroup": "O+",
      "distanceKm": 4.1,
      "availability": "Available",
      "donations": 2,
      "reliabilityScore": 88,
      "eligible": true,
      "lastDonationMonths": 8,
      "lat": 12.9456,
      "lng": 77.6890,
      "phone": "+91-9876543211",
      "createdAt": 1704067200000
    }
  }
}
```

4. Click **Import**

---

### Option C: Use CSV/Excel Data

If you have donor data in Excel/CSV:

**Step 1: Convert CSV to JSON**

```python
import csv
import json

csv_file = 'donors.csv'
json_file = 'donors.json'

with open(csv_file) as f:
    data = list(csv.DictReader(f))
    
donors = {}
for i, row in enumerate(data):
    donor_id = f"d{i+1}"
    donors[donor_id] = {
        "id": donor_id,
        "name": row['name'],
        "bloodGroup": row['blood_group'],
        "phone": row['phone'],
        "lat": float(row['latitude']),
        "lng": float(row['longitude']),
        "availability": "Available",
        "donations": int(row.get('donations', 0)),
        "reliabilityScore": int(row.get('score', 80)),
        "eligible": row.get('eligible', 'true').lower() == 'true',
        "lastDonationMonths": int(row.get('last_donation_months', 6)),
        "distanceKm": float(row.get('distance', 5.0)),
        "createdAt": 1704067200000
    }

with open(json_file, 'w') as f:
    json.dump({"donors": donors}, f, indent=2)

print(f"✅ Converted {len(donors)} donors to {json_file}")
```

**Step 2: Import into Firebase**
1. Firebase Console → Realtime Database
2. Click 3-dot → **Import JSON**
3. Select your generated `donors.json`
4. Click **Import**

---

### Option D: Real Hospital Data (Google Maps API)

Get real hospital coordinates:

```python
import requests

# Get hospitals near a location using Google Maps API
def get_hospitals(city, api_key):
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": f"hospitals in {city}",
        "key": api_key
    }
    
    response = requests.get(url, params=params)
    results = response.json()['results']
    
    hospitals = {}
    for i, place in enumerate(results[:10]):
        hosp_id = f"h{i+1}"
        hospitals[hosp_id] = {
            "id": hosp_id,
            "name": place['name'],
            "location": place.get('formatted_address', ''),
            "lat": place['geometry']['location']['lat'],
            "lng": place['geometry']['location']['lng'],
            "createdAt": 1704067200000
        }
    
    return hospitals

# Usage:
hospitals = get_hospitals("Bengaluru", "YOUR_GOOGLE_MAPS_API_KEY")
print(json.dumps({"hospitals": hospitals}, indent=2))
```

Then import into Firebase as JSON.

---

### Option E: Real Blood Bank Data (Government Registry)

Many countries have official blood bank registries:

**India:**
- National Blood Transfusion Council: https://nbtc.naco.gov.in
- AABB directory: https://www.aabb.org

**Steps:**
1. Download facility list from government registry
2. Extract coordinates (latitude/longitude)
3. Convert to JSON format matching Firebase schema
4. Import to Firebase

---

## Part 3: Verify Firebase Connection

### Check If Data Is Loading

1. **Frontend Console:** Open browser DevTools → Console
2. Look for message: `✅ Firebase Connected!` or warning
3. Check if donors, hospitals are showing in the app

### Check Firebase Database

1. Go to Firebase Console → **Realtime Database**
2. Expand **"donors"**, **"hospitals"**, **"emergency_requests"**
3. Should see real data populated

---

## Part 4: Keep Data Updated

### Auto-Sync With Backend

If you already have data in Supabase backend:

```typescript
// src/lib/syncFirebase.ts
import { donorService, hospitalService } from '@/lib/firebase';

export async function syncSupabaseToFirebase() {
  try {
    // Get data from backend
    const donorsResponse = await fetch('http://localhost:3001/api/donors');
    const hospitalsResponse = await fetch('http://localhost:3001/api/hospitals');
    
    const donors = await donorsResponse.json();
    const hospitals = await hospitalsResponse.json();
    
    // Save to Firebase
    for (const donor of donors) {
      await donorService.create(donor);
    }
    
    for (const hospital of hospitals) {
      await hospitalService.create(hospital);
    }
    
    console.log('✅ Sync complete!');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Run sync
syncSupabaseToFirebase();
```

---

## Part 5: Real-Time Updates

Firebase auto-syncs! Any updates in Firebase Dashboard instantly show in the app.

**Test it:**

1. App open → Donor Dashboard showing 10 donors
2. Firebase Console → Add new donor manually
3. **See it appear in app instantly!** ✨

---

## Troubleshooting

### "Firebase not configured. Using mock data."

**Solution:** 
- Check `.env.local` has all Firebase credentials
- Reload the page
- Check browser console for errors

### "Permission denied" errors

**Solution:**
- Go to Firebase → Realtime Database → Rules tab
- Make sure you published the security rules from `firebase-rules.json`

### Data not showing

**Solution:**
1. Check Firebase Console → Data is there?
2. Check Network tab → Firebase requests successful?
3. Check browser console → Any errors?

---

## Next: Get Real SMS Notifications

Once Firebase is working, you can add Twilio SMS:

```bash
npm install twilio
```

See `MIGRATION_GUIDE.md` for SMS setup steps.

---

**Questions?** Check `README.md` for API documentation!
