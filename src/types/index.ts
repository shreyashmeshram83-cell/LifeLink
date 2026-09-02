export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
export type Component = 'RBC' | 'Platelets' | 'Plasma' | 'Whole Blood';
export type Urgency = 'Critical' | 'Urgent' | 'Normal';
export type Availability = 'Available' | 'Unavailable' | 'Responded';
export type RequestStatus =
  | 'VERIFYING'
  | 'VERIFIED'
  | 'MATCHING'
  | 'DONORS_NOTIFIED'
  | 'DONOR_RESPONDING'
  | 'FULFILLED';

export type DemoRole = 'patient' | 'hospital' | 'donor' | 'admin' | null;

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  distanceKm: number;
  availability: Availability;
  donations: number;
  reliabilityScore: number;
  eligible: boolean;
  lastDonationMonths: number;
  lat: number;
  lng: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
}

export interface BloodBank {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  component: Component;
  unitsRequired: number;
  hospital: string;
  hospitalLocation: string;
  urgency: Urgency;
  contactNumber: string;
  status: RequestStatus;
  createdAt: number;
  matchedDonors: number;
  respondingDonors: number;
  notifiedDonors: number;
  matchedDonorNames: string[];
  respondingDonorNames: string[];
}

export interface BloodInventoryItem {
  group: BloodGroup;
  units: number;
  status: 'Healthy' | 'Low' | 'Critical';
}

export interface TimelineStep {
  label: string;
  done: boolean;
}

export interface AIParseResult {
  bloodGroup: BloodGroup | null;
  component: Component | null;
  units: number | null;
  urgency: Urgency | null;
  hospital: string | null;
  confidence: number;
}
