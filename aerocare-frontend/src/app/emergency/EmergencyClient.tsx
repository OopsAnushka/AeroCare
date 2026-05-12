'use client';
import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import FloatingInterface from '@/components/FloatingInterface';
import { fetchNearbyHospitals, fetchNearbyVolunteers } from '@/lib/api';
import { Map as MapIcon, LayoutList } from 'lucide-react';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export type TabId = 'dispatch' | 'hospitals' | 'blood' | 'cpr';
export interface Volunteer { id: number; name: string; cert: string; distance: string; eta: string; pos: [number, number]; }
export interface HospitalData { id: number; name: string; beds: number; distance: string; pos: [number, number]; }

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
  const [mobileView, setMobileView] = useState<'panel' | 'map'>('panel');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);

  const setActiveTab = useCallback((t: TabId) => setActiveTabRaw(t), []);
  const setPickupLocation = useCallback((l: [number, number] | null) => setPickupRaw(l), []);
  const setHospitalRoute = useCallback((r: [number, number][] | null) => setHospitalRouteRaw(r), []);
  const setDispatched = useCallback((d: boolean) => setDispatchedRaw(d), []);

  useEffect(() => {
    if (searchLat && searchLon) {
      const lat = parseFloat(searchLat), lon = parseFloat(searchLon);
      if (!isNaN(lat) && !isNaN(lon)) { setSearchedLocation([lat, lon]); setActiveTabRaw('hospitals'); }
    }
  }, [searchLat, searchLon]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      (p) => setUserLocation([p.coords.latitude, p.coords.longitude]),
      () => {}, { enableHighAccuracy: true, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  useEffect(() => {
    async function load() {
      const [lat, lon] = userLocation;
      try {
        const [vols, hosps] = await Promise.all([fetchNearbyVolunteers(lat, lon), fetchNearbyHospitals(lat, lon)]);
        setVolunteers(vols); setHospitals(hosps);
      } catch (e) { console.error(e); }
    }
    load();
  }, [userLocation]);

  const mapCenter = searchedLocation || pickupLocation || userLocation;
  const showMap = mobileView === 'map';

  return (
    <div className="flex-1 w-full h-[calc(100dvh-60px)] md:h-[calc(100dvh-68px)] relative overflow-hidden">
      <MapView center={mapCenter} userLocation={userLocation} activeTab={activeTab}
        pickupLocation={pickupLocation} hospitalRoute={hospitalRoute}
        volunteers={volunteers} hospitals={hospitals} dispatched={dispatched} dispatchData={dispatchData} />

      {/* Mobile map header */}
      {showMap && (
        <div className="md:hidden fixed top-[60px] inset-x-0 z-[500] bg-black/85 backdrop-blur-md flex items-center justify-between px-4 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-sm font-bold">Live Map</span>
          </div>
          <button onClick={() => setMobileView('panel')}
            className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            <LayoutList className="w-3.5 h-3.5" /> Back to Panel
          </button>
        </div>
      )}

      {/* Mobile panel */}
      <div className={`md:hidden absolute inset-x-0 bottom-0 z-[400] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${showMap ? 'translate-y-full' : 'translate-y-0'}`}>
        <FloatingInterface activeTab={activeTab} setActiveTab={setActiveTab}
          setPickupLocation={setPickupLocation} setHospitalRoute={setHospitalRoute}
          userLocation={userLocation} volunteers={volunteers} hospitals={hospitals}
          dispatched={dispatched} setDispatched={setDispatched}
          dispatchData={dispatchData} setDispatchData={setDispatchData} />
      </div>

      {/* Desktop panel */}
      <div className="hidden md:flex absolute top-4 left-4 bottom-4 w-[420px] z-[400] flex-col">
        <FloatingInterface activeTab={activeTab} setActiveTab={setActiveTab}
          setPickupLocation={setPickupLocation} setHospitalRoute={setHospitalRoute}
          userLocation={userLocation} volunteers={volunteers} hospitals={hospitals}
          dispatched={dispatched} setDispatched={setDispatched}
          dispatchData={dispatchData} setDispatchData={setDispatchData} />
      </div>

      {/* Mobile FAB */}
      <button onClick={() => setMobileView(v => v === 'map' ? 'panel' : 'map')}
        className={`md:hidden fixed z-[500] transition-all duration-300 active:scale-90 shadow-2xl
          ${showMap
            ? 'bottom-6 left-1/2 -translate-x-1/2 bg-white text-black border border-gray-200 px-6 py-3 rounded-full flex items-center gap-2'
            : 'bottom-6 right-5 w-14 h-14 rounded-full bg-red-500 text-white shadow-red-500/40 flex items-center justify-center'}`}>
        {showMap ? (
          <><LayoutList className="w-5 h-5" /><span className="text-sm font-bold">Panel</span></>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <MapIcon className="w-6 h-6" />
            <span className="text-[8px] font-extrabold uppercase tracking-wide">Map</span>
          </div>
        )}
      </button>
    </div>
  );
}