'use client';
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { getUserProfile, type UserProfile } from '@/lib/firestore';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  /** Fetches the latest profile from Firestore and returns it */
  refreshProfile: () => Promise<UserProfile | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => null,
});

const PROFILE_CACHE_KEY = 'aerocare_profile_cache';

function getCachedProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function setCachedProfile(p: UserProfile | null) {
  try {
    if (p) localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(p));
    else localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  /** Fetches profile, falls back to localStorage cache when offline */
  const fetchProfile = useCallback(async (u: User): Promise<UserProfile | null> => {
    try {
      const p = await getUserProfile(u.uid);
      setProfile(p);
      setCachedProfile(p);  // persist to cache on success
      return p;
    } catch (err: any) {
      const isOffline = err?.message?.includes('offline') ||
                        err?.code === 'unavailable' ||
                        !navigator.onLine;

      if (isOffline) {
        // Use localStorage cache so the dashboard still loads
        const cached = getCachedProfile();
        console.warn('Firestore offline — using cached profile:', cached?.role ?? 'none');
        setProfile(cached);
        return cached;
      }

      console.warn('Warning fetching profile:', err);
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    if (!auth) { setLoading(false); return; }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Immediately apply cached profile to avoid loading-spinner freeze
        const cached = getCachedProfile();
        if (cached) setProfile(cached);

        // Then fetch fresh from Firestore
        await fetchProfile(u);
      } else {
        setProfile(null);
        setCachedProfile(null);
      }
      setLoading(false);
    });

    return unsub;
  }, [fetchProfile]);

  const signOut = useCallback(async () => {
    if (!auth) return;
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
    setCachedProfile(null);
  }, []);

  /** Public refreshProfile — returns the fetched profile so callers can act on it immediately */
  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!user) return null;
    return fetchProfile(user);
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
