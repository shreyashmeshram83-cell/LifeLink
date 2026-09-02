import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type {
  EmergencyRequest,
  Donor,
  DemoRole,
  RequestStatus,
  Hospital,
} from '@/types';
import { donors as initialDonors, initialRequests } from '@/data/mockData';
import { 
  donorService, 
  hospitalService, 
  requestService,
  authService 
} from '@/lib/firebase';

export type View =
  | 'login'
  | 'landing'
  | 'request-form'
  | 'verification'
  | 'ai-matching'
  | 'broadcast'
  | 'tracking'
  | 'donor-dashboard'
  | 'hospital-dashboard'
  | 'admin-dashboard'
  | 'inventory'
  | 'map'
  | 'nearby-emergency'
  | 'ai-assistant';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: DemoRole;
  lat?: number;
  lng?: number;
}

export interface CommunityNotification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  type: 'community' | 'system';
}

interface AppState {
  view: View;
  setView: (v: View) => void;
  role: DemoRole;
  setRole: (r: DemoRole) => void;
  requests: EmergencyRequest[];
  activeRequest: EmergencyRequest | null;
  donors: Donor[];
  hospitals: Hospital[];
  notifications: CommunityNotification[];
  fetchNearbyHospitals: (coords?: { lat: number; lng: number }) => Promise<Hospital[]>;
  addRequest: (req: EmergencyRequest) => void;
  addSystemNotification: (title: string, message: string) => void;
  updateRequestStatus: (id: string, status: RequestStatus, updates?: Partial<EmergencyRequest>) => void;
  setActiveRequest: (r: EmergencyRequest | null) => void;
  updateDonorAvailability: (id: string, availability: Donor['availability']) => void;
  currentDonor: Donor;
  // User & Auth
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (name: string, email: string, phone: string, role: DemoRole) => void;
  logout: () => void;
  // Geolocation
  userLocation: { lat: number; lng: number } | null;
  requestLocation: () => Promise<{ lat: number; lng: number } | null>;
}

const AppContext = createContext<AppState | null>(null);

const DEFAULT_LOCATION = { lat: 21.1458, lng: 79.0882 };

const toHospital = (element: any, index: number): Hospital | null => {
  if (!element) return null;

  const lat = Number(element.lat ?? element.center?.lat);
  const lng = Number(element.lon ?? element.center?.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const tags = element.tags ?? {};
  const name = tags.name || tags['operator'] || `Hospital ${index + 1}`;
  const location = tags['addr:city'] || tags.city || tags['addr:district'] || 'Nearby location';

  return {
    id: String(element.id ?? `hospital-${index}`),
    name,
    location,
    lat,
    lng,
  };
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('login');
  const [role, setRole] = useState<DemoRole>(null);
  const [requests, setRequests] = useState<EmergencyRequest[]>(initialRequests);
  const [activeRequest, setActiveRequest] = useState<EmergencyRequest | null>(null);
  const [donors, setDonors] = useState<Donor[]>(initialDonors);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [notifications, setNotifications] = useState<CommunityNotification[]>([
    {
      id: 'welcome-notice',
      title: 'System ready',
      message: 'The donor community is ready to receive emergency blood alerts.',
      createdAt: Date.now(),
      type: 'system',
    },
  ]);
  
  // User & Auth
  const [user, setUser] = useState<UserProfile | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('lifelink_user');
    const savedLocation = localStorage.getItem('lifelink_location');
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setRole(parsedUser.role);
        setView(parsedUser.role === 'admin' ? 'admin-dashboard' : 'landing');
      } catch (e) {
        console.error('Failed to parse saved user:', e);
      }
    }

    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setUserLocation(parsedLocation);
      } catch (e) {
        console.error('Failed to parse saved location:', e);
      }
    }
  }, []);

  // 🔥 Load data from Firebase (Real-time)
  useEffect(() => {
    let unsubscribeDonors: any;
    let unsubscribeHospitals: any;
    let unsubscribeRequests: any;

    try {
      // Subscribe to donors
      unsubscribeDonors = donorService.subscribe((firebaseDonors) => {
        setDonors(firebaseDonors.length > 0 ? firebaseDonors : initialDonors);
      });

      // Subscribe to hospitals
      unsubscribeHospitals = hospitalService.subscribe((firebaseHospitals) => {
        setHospitals(firebaseHospitals.length > 0 ? firebaseHospitals : []);
      });

      // Subscribe to emergency requests
      unsubscribeRequests = requestService.subscribe((firebaseRequests) => {
        setRequests(firebaseRequests.length > 0 ? firebaseRequests : initialRequests);
      });
    } catch (error) {
      console.warn('Firebase not configured. Using mock data.', error);
      // Keep using mock data if Firebase is not set up
    }

    return () => {
      if (unsubscribeDonors) unsubscribeDonors();
      if (unsubscribeHospitals) unsubscribeHospitals();
      if (unsubscribeRequests) unsubscribeRequests();
    };
  }, []);

  const currentDonor = donors[0];

  const fetchNearbyHospitals = useCallback(async (coords = userLocation ?? DEFAULT_LOCATION) => {
    const lat = coords.lat;
    const lng = coords.lng;
    const radius = 0.18;
    const minLat = lat - radius;
    const maxLat = lat + radius;
    const minLng = lng - radius;
    const maxLng = lng + radius;

    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](${minLat},${minLng},${maxLat},${maxLng});
        way["amenity"="hospital"](${minLat},${minLng},${maxLat},${maxLng});
        relation["amenity"="hospital"](${minLat},${minLng},${maxLat},${maxLng});
      );
      out center 30;
    `;

    try {
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const nearby = (result.elements ?? [])
        .map((element: any, index: number) => toHospital(element, index))
        .filter((value): value is Hospital => Boolean(value))
        .slice(0, 20);

      setHospitals(nearby);
      return nearby;
    } catch (error) {
      console.error('Failed to load nearby hospitals from OpenStreetMap:', error);
      setHospitals([]);
      return [];
    }
  }, [userLocation]);

  const addSystemNotification = useCallback((title: string, message: string) => {
    setNotifications((prev) => [
      {
        id: `notice-${Date.now()}-${Math.random()}`,
        title,
        message,
        createdAt: Date.now(),
        type: 'community',
      },
      ...prev,
    ].slice(0, 8));
  }, []);

  const addRequest = useCallback((req: EmergencyRequest) => {
    // Save to local state
    setRequests((prev) => [req, ...prev]);
    setActiveRequest(req);
    
    // Save to Firebase
    try {
      requestService.create(req);
    } catch (error) {
      console.warn('Failed to save request to Firebase:', error);
    }
    
    addSystemNotification(
      'New blood request posted',
      `${req.patientName} needs ${req.component} (${req.bloodGroup}) at ${req.hospital}. All active donors are being notified.`
    );
  }, [addSystemNotification]);

  const updateRequestStatus = useCallback(
    (id: string, status: RequestStatus, updates?: Partial<EmergencyRequest>) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status, ...updates } : r))
      );
      setActiveRequest((prev) =>
        prev && prev.id === id ? { ...prev, status, ...updates } : prev
      );
      
      // Update in Firebase
      try {
        requestService.updateStatus(id, status, updates);
      } catch (error) {
        console.warn('Failed to update request in Firebase:', error);
      }
    },
    []
  );

  const updateDonorAvailability = useCallback((id: string, availability: Donor['availability']) => {
    setDonors((prev) => prev.map((d) => (d.id === id ? { ...d, availability } : d)));
    
    // Update in Firebase
    try {
      donorService.update(id, { availability });
    } catch (error) {
      console.warn('Failed to update donor in Firebase:', error);
    }
  }, []);

  const login = useCallback((name: string, email: string, phone: string, userRole: DemoRole) => {
    const userProfile: UserProfile = {
      id: `user_${Date.now()}`,
      name,
      email,
      phone,
      role: userRole,
      lat: userLocation?.lat,
      lng: userLocation?.lng,
    };
    
    setUser(userProfile);
    setRole(userRole);
    localStorage.setItem('lifelink_user', JSON.stringify(userProfile));
    localStorage.setItem('lifelink_lastLogin', new Date().toISOString());
    
    setView(userRole === 'admin' ? 'admin-dashboard' : 'landing');
  }, [userLocation]);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('lifelink_user');
    localStorage.removeItem('lifelink_location');
    setView('login');
  }, []);

  const requestLocation = useCallback(async () => {
    return new Promise<{ lat: number; lng: number } | null>((resolve) => {
      if (!navigator.geolocation) {
        console.error('Geolocation not supported');
        const fallback = DEFAULT_LOCATION;
        setUserLocation(fallback);
        localStorage.setItem('lifelink_location', JSON.stringify(fallback));
        resolve(fallback);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          
          if (user) {
            const updatedUser = { ...user, lat: location.lat, lng: location.lng };
            setUser(updatedUser);
            localStorage.setItem('lifelink_user', JSON.stringify(updatedUser));
          }
          
          localStorage.setItem('lifelink_location', JSON.stringify(location));
          fetchNearbyHospitals(location);
          resolve(location);
        },
        (error) => {
          console.error('Geolocation error:', error);
          const defaultLocation = DEFAULT_LOCATION;
          setUserLocation(defaultLocation);
          localStorage.setItem('lifelink_location', JSON.stringify(defaultLocation));
          fetchNearbyHospitals(defaultLocation);
          resolve(defaultLocation);
        }
      );
    });
  }, [fetchNearbyHospitals, user]);

  useEffect(() => {
    const initialLocation = userLocation ?? DEFAULT_LOCATION;
    fetchNearbyHospitals(initialLocation);
  }, [fetchNearbyHospitals, userLocation]);

  return (
    <AppContext.Provider
      value={{
        view,
        setView,
        role,
        setRole,
        requests,
        activeRequest,
        donors,
        hospitals,
        notifications,
        fetchNearbyHospitals,
        addRequest,
        addSystemNotification,
        updateRequestStatus,
        setActiveRequest,
        updateDonorAvailability,
        currentDonor,
        user,
        isLoggedIn: !!user,
        login,
        logout,
        userLocation,
        requestLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
