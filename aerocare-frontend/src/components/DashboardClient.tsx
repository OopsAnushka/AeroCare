'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import FloatingInterface from './FloatingInterface';

const MapView = dynamic(() => import('./MapView'), { ssr: false });

export type TabId = 'dispatch' | 'radar' | 'hospitals' | 'blood' | 'cpr';

export interface Volunteer {
  id: number;
  name: string;
  cert: string;
  distance: string;
  eta: string;
  pos: [number, number];
}

export interface HospitalData {
  id: number;
  name: string;
  beds: number;
  distance: string;
  pos: [number, number];
}

export default function DashboardClient() {
  const [activeTab, setActiveTabRaw] = useState<TabId>('dispatch');
  const [userLocation, setUserLocation] = useState<[number, number]>([22.7196, 75.8577]);
  const [pickupLocation, setPickupRaw] = useState<[number, number] | null>(null);
  const [hospitalRoute, setHospitalRouteRaw] = useState<[number, number][] | null>(null);
  const [dispatched, setDispatchedRaw] = useState(false);

  // Stable callbacks
  const setActiveTab = useCallback((t: TabId) => setActiveTabRaw(t), []);
  const setPickupLocation = useCallback((l: [number, number] | null) => setPickupRaw(l), []);
  const setHospitalRoute = useCallback((r: [number, number][] | null) => setHospitalRouteRaw(r), []);
  const setDispatched = useCallback((d: boolean) => setDispatchedRaw(d), []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => console.log('Geolocation denied — using Indore fallback'),
      { enableHighAccuracy: true, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Mock data — positions relative to user
  const volunteers: Volunteer[] = useMemo(
    () => [
      { id: 1, name: 'Priya Verma', cert: 'Red Cross CPR', distance: '0.3 km', eta: '2 min', pos: [userLocation[0] + 0.004, userLocation[1] + 0.003] },
      { id: 2, name: 'Rahul Sharma', cert: 'AHA BLS', distance: '0.7 km', eta: '5 min', pos: [userLocation[0] - 0.003, userLocation[1] + 0.006] },
      { id: 3, name: 'Aisha Khan', cert: 'ACLS Certified', distance: '1.1 km', eta: '8 min', pos: [userLocation[0] + 0.008, userLocation[1] - 0.002] },
    ],
    [userLocation],
  );

  const hospitals: HospitalData[] = useMemo(
    () => [
      { id: 1, name: 'Bombay Hospital', beds: 4, distance: '1.8 km', pos: [userLocation[0] + 0.014, userLocation[1] - 0.011] },
      { id: 2, name: 'MY Hospital', beds: 1, distance: '2.9 km', pos: [userLocation[0] - 0.007, userLocation[1] + 0.016] },
      { id: 3, name: 'CHL Apollo', beds: 7, distance: '3.5 km', pos: [userLocation[0] + 0.02, userLocation[1] + 0.008] },
    ],
    [userLocation],
  );

  const mapCenter = pickupLocation || userLocation;

  return (
    <div className="flex-1 w-full h-[calc(100vh-68px)] relative overflow-hidden">
      <MapView
        center={mapCenter}
        userLocation={userLocation}
        activeTab={activeTab}
        pickupLocation={pickupLocation}
        hospitalRoute={hospitalRoute}
        volunteers={volunteers}
        hospitals={hospitals}
        dispatched={dispatched}
      />
      <FloatingInterface
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setPickupLocation={setPickupLocation}
        setHospitalRoute={setHospitalRoute}
        userLocation={userLocation}
        volunteers={volunteers}
        hospitals={hospitals}
        dispatched={dispatched}
        setDispatched={setDispatched}
      />
    </div>
  );
}
