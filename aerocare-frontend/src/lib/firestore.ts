import { db } from './firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// ── Types ──
export interface CivilianProfile {
  role: 'civilian';
  fullName: string;
  phone: string;
  dob?: string;
  age?: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  medicalHistory?: string;
  currentMedicine?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface DonorProfile {
  role: 'donor';
  fullName: string;
  phone: string;
  dob?: string;
  age?: string;
  bloodType?: string;
  weight?: string;
  lastDonation?: string;
  conditions?: string;
  healthInfo?: string;
  photoId?: string;
  hemoglobinLevel?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  email: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface AmbulanceUnit {
  id: string;
  vehiclePlate: string;
  driverName: string;
  driverPhone: string;
  unitType: 'ALS' | 'BLS' | 'Patient Transport';
  status: 'available' | 'dispatched' | 'maintenance' | 'offline';
  lat?: number;
  lng?: number;
  lastLocationUpdate?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;           // e.g. "Doctor", "Nurse", "Paramedic"
  department: string;
  phone?: string;
  shift: 'morning' | 'evening' | 'night';
  status: 'on-duty' | 'off-duty' | 'on-leave';
}

export interface HospitalProfile {
  role: 'hospital';
  hospitalName: string;
  registrationNumber?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  email: string;

  // Resource counts (string so they map cleanly to form inputs)
  totalBeds?: string;
  availableBeds?: string;
  icuBeds?: string;
  availableIcuBeds?: string;
  ventilators?: string;
  availableVentilators?: string;
  operationTheatres?: string;
  availableOTs?: string;

  // Lists
  ambulances?: AmbulanceUnit[];
  staff?: StaffMember[];

  // Legacy
  ambulances_list?: any[];
  contactPerson?: string;
  contactRole?: string;

  createdAt?: any;
  updatedAt?: any;
}

export interface AmbulanceDriverProfile {
  role: 'ambulance_driver';
  fullName: string;
  phone: string;
  aadharNo?: string;
  licenceNo?: string;
  vehiclePlate: string;
  unitType?: string;
  assignedHospital?: string;
  hospitalAddress?: string;
  city?: string;
  state?: string;
  email: string;
  createdAt?: any;
  updatedAt?: any;
}

export type UserProfile = CivilianProfile | DonorProfile | HospitalProfile | AmbulanceDriverProfile;

// ── Save user profile to Firestore ──
export async function saveUserProfile(uid: string, profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>) {
  if (!db) { console.warn('Firestore not initialized'); return; }
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    ...profile,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ── Create user profile (sets createdAt) ──
export async function createUserProfile(uid: string, profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>) {
  if (!db) { console.warn('Firestore not initialized'); return; }
  const ref = doc(db, 'users', uid);
  await setDoc(ref, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// ── Get user profile from Firestore ──
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) { console.warn('Firestore not initialized'); return null; }
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

// ── Update specific hospital resource fields ──
export async function updateHospitalResources(uid: string, resources: Partial<HospitalProfile>) {
  if (!db) { console.warn('Firestore not initialized'); return; }
  const ref = doc(db, 'users', uid);
  await updateDoc(ref, { ...resources, updatedAt: serverTimestamp() });
}
