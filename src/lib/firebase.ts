import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update, remove, onValue, push, child } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import type { Donor, Hospital, EmergencyRequest } from '@/types';

// 🔴 REPLACE THESE WITH YOUR FIREBASE PROJECT DETAILS
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'lifelink-xxx.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://lifelink-xxx.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'lifelink-xxx',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'lifelink-xxx.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:xxxxx',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// ============================================
// 📍 DONORS OPERATIONS
// ============================================
export const donorService = {
  // Get all donors (one-time fetch)
  async getAll() {
    const snapshot = await get(ref(db, 'donors'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val()) as Donor[];
    }
    return [];
  },

  // Subscribe to donors (real-time updates)
  subscribe(callback: (donors: Donor[]) => void) {
    const donorsRef = ref(db, 'donors');
    onValue(donorsRef, (snapshot) => {
      if (snapshot.exists()) {
        const donors = Object.values(snapshot.val()) as Donor[];
        callback(donors);
      }
    });
  },

  // Get single donor
  async getById(id: string) {
    const snapshot = await get(child(ref(db), `donors/${id}`));
    if (snapshot.exists()) {
      return snapshot.val() as Donor;
    }
    return null;
  },

  // Add new donor
  async create(donor: Omit<Donor, 'id'>) {
    const newRef = push(ref(db, 'donors'));
    await set(newRef, { ...donor, id: newRef.key, createdAt: Date.now() });
    return newRef.key;
  },

  // Update donor
  async update(id: string, updates: Partial<Donor>) {
    await update(ref(db, `donors/${id}`), { ...updates, updatedAt: Date.now() });
  },

  // Delete donor
  async delete(id: string) {
    await remove(ref(db, `donors/${id}`));
  },
};

// ============================================
// 🏥 HOSPITALS OPERATIONS
// ============================================
export const hospitalService = {
  // Get all hospitals (one-time fetch)
  async getAll() {
    const snapshot = await get(ref(db, 'hospitals'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val()) as Hospital[];
    }
    return [];
  },

  // Subscribe to hospitals (real-time updates)
  subscribe(callback: (hospitals: Hospital[]) => void) {
    const hospitalsRef = ref(db, 'hospitals');
    onValue(hospitalsRef, (snapshot) => {
      if (snapshot.exists()) {
        const hospitals = Object.values(snapshot.val()) as Hospital[];
        callback(hospitals);
      }
    });
  },

  // Get single hospital
  async getById(id: string) {
    const snapshot = await get(child(ref(db), `hospitals/${id}`));
    if (snapshot.exists()) {
      return snapshot.val() as Hospital;
    }
    return null;
  },

  // Add new hospital
  async create(hospital: Omit<Hospital, 'id'>) {
    const newRef = push(ref(db, 'hospitals'));
    await set(newRef, { ...hospital, id: newRef.key, createdAt: Date.now() });
    return newRef.key;
  },

  // Update hospital
  async update(id: string, updates: Partial<Hospital>) {
    await update(ref(db, `hospitals/${id}`), { ...updates, updatedAt: Date.now() });
  },
};

// ============================================
// 🚨 EMERGENCY REQUESTS OPERATIONS
// ============================================
export const requestService = {
  // Get all requests (one-time fetch)
  async getAll() {
    const snapshot = await get(ref(db, 'emergency_requests'));
    if (snapshot.exists()) {
      return Object.values(snapshot.val()) as EmergencyRequest[];
    }
    return [];
  },

  // Subscribe to requests (real-time updates)
  subscribe(callback: (requests: EmergencyRequest[]) => void) {
    const requestsRef = ref(db, 'emergency_requests');
    onValue(requestsRef, (snapshot) => {
      if (snapshot.exists()) {
        const requests = Object.values(snapshot.val()) as EmergencyRequest[];
        callback(requests);
      }
    });
  },

  // Get single request
  async getById(id: string) {
    const snapshot = await get(child(ref(db), `emergency_requests/${id}`));
    if (snapshot.exists()) {
      return snapshot.val() as EmergencyRequest;
    }
    return null;
  },

  // Create new request
  async create(request: Omit<EmergencyRequest, 'id' | 'createdAt'>) {
    const newRef = push(ref(db, 'emergency_requests'));
    await set(newRef, { ...request, id: newRef.key, createdAt: Date.now() });
    return newRef.key;
  },

  // Update request status
  async updateStatus(id: string, status: string, updates?: Partial<EmergencyRequest>) {
    await update(ref(db, `emergency_requests/${id}`), { 
      status, 
      ...updates,
      updatedAt: Date.now() 
    });
  },
};

// ============================================
// 🔐 AUTHENTICATION OPERATIONS
// ============================================
export const authService = {
  // Sign up user
  async signup(email: string, password: string, name: string, phone: string, role: string) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Save user profile to database
    await set(ref(db, `users/${uid}`), {
      id: uid,
      email,
      name,
      phone,
      role,
      createdAt: Date.now(),
    });
    
    return uid;
  },

  // Login user
  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  // Logout user
  async logout() {
    await signOut(auth);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  },
};

// ============================================
// 📊 BLOOD INVENTORY OPERATIONS
// ============================================
export const inventoryService = {
  // Get all inventory
  async getAll() {
    const snapshot = await get(ref(db, 'blood_inventory'));
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  },

  // Subscribe to inventory (real-time)
  subscribe(callback: (inventory: any) => void) {
    const inventoryRef = ref(db, 'blood_inventory');
    onValue(inventoryRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      }
    });
  },

  // Update inventory for blood group
  async updateBloodGroup(bloodGroup: string, units: number, status: string) {
    await set(ref(db, `blood_inventory/${bloodGroup}`), {
      group: bloodGroup,
      units,
      status,
      updatedAt: Date.now(),
    });
  },
};
