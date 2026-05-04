import { db } from './firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// ── Types ──
export interface CivilianProfile {
  role: 'civilian';
  fullName: string;
  phone: string;
  dob: string;
  bloodType: string;
  allergies: string;
  medications: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  email: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface DonorProfile {
  role: 'donor';
  fullName: string;
  phone: string;
  dob: string;
  bloodType: string;
  weight: string;
  lastDonation: string;
  conditions: string;
  address: string;
  email: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface HospitalProfile {
  role: 'hospital';
  hospitalName: string;
  registrationNumber: string;
  phone: string;
  address: string;
  icuBeds: string;
  ambulances: string;
  contactPerson: string;
  contactRole: string;
  email: string;
  createdAt?: any;
  updatedAt?: any;
}

export type UserProfile = CivilianProfile | DonorProfile | HospitalProfile;

// ── Save user profile to Firestore ──
export async function saveUserProfile(uid: string, profile: Omit<UserProfile, 'createdAt' | 'updatedAt'>) {
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
