'use client';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import FloatingInterface from '@/components/FloatingInterface';
import { fetchNearbyHospitals, fetchNearbyVolunteers } from '@/lib/api';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export type TabId = 'dispatch' | 'hospitals' | 'blood' | 'cpr';

export interface Volunteer {
  id: number; name: string; cert: string; distance: string; eta: string; pos: [number, number];
}
export interface HospitalData {
  id: number; name: string; beds: number; distance: string; pos: [number, number];
}

export default function EmergencyClient() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabId) || 'dispatch';
  const searchLat = searchParams.get('lat');
  const searchLon = searchParams.get('lon');

  const [activeTab, setActiveTabRaw] = useState<TabId>(initialTab);
  const [userLocation, setUserLocation] = useState<[number, number]>([22.7196, 75.8577]);
  const [pickupLocation, setPickupRaw] = useState<[number, number] | null>(null);
  const [hospitalRoute, setHospitalRouteRaw] = useState<[number, number][] | null>(null);
  const [dispatched, setDispatchedRaw] = useState(false);
  const [dispatchData, setDispatchData] = useState<any>(null);
  const [searchedLocation, setSearchedLocation] = useState<[number, number] | null>(null);

  // Data states from backend
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);

  const setActiveTab = useCallback((t: TabId) => setActiveTabRaw(t), []);
  const setPickupLocation = useCallback((l: [number, number] | null) => setPickupRaw(l), []);
  const setHospitalRoute = useCallback((r: [number, number][] | null) => setHospitalRouteRaw(r), []);
  const setDispatched = useCallback((d: boolean) => setDispatchedRaw(d), []);

  // If search params have lat/lon, fly to that location
  useEffect(() => {
    if (searchLat && searchLon) {
      const lat = parseFloat(searchLat);
      const lon = parseFloat(searchLon);
      if (!isNaN(lat) && !isNaN(lon)) {
        setSearchedLocation([lat, lon]);
        setActiveTabRaw('hospitals');
      }
    }
  }, [searchLat, searchLon]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
      () => console.log('Geolocation denied — using Indore fallback'),
      { enableHighAccuracy: true, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Fetch data from backend when location changes
  useEffect(() => {
    async function loadData() {
      const [lat, lon] = userLocation;
      
      try {
        const [vols, hosps] = await Promise.all([
          fetchNearbyVolunteers(lat, lon),
          fetchNearbyHospitals(lat, lon)
        ]);
        setVolunteers(vols);
        setHospitals(hosps);
      } catch (err) {
        console.error('Failed to load data from backend:', err);
      }
    }
    
    loadData();
  }, [userLocation]);

  // Priority: searched location > pickup location > user location
  const mapCenter = searchedLocation || pickupLocation || userLocation;

  return (
    <div className="flex-1 w-full h-[calc(100vh-60px)] md:h-[calc(100vh-68px)] relative overflow-hidden">
      <MapView center={mapCenter} userLocation={userLocation} activeTab={activeTab} pickupLocation={pickupLocation} hospitalRoute={hospitalRoute} volunteers={volunteers} hospitals={hospitals} dispatched={dispatched} dispatchData={dispatchData} />
      <FloatingInterface activeTab={activeTab} setActiveTab={setActiveTab} setPickupLocation={setPickupLocation} setHospitalRoute={setHospitalRoute} userLocation={userLocation} volunteers={volunteers} hospitals={hospitals} dispatched={dispatched} setDispatched={setDispatched} dispatchData={dispatchData} setDispatchData={setDispatchData} />
    </div>
  );
}
