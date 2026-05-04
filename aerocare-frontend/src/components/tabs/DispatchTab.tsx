'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Search, Shield, Zap, CircleDot, Loader2, Sparkles } from 'lucide-react';
import { dispatchAmbulance } from '@/lib/api';

interface Props {
  setPickupLocation: (l: [number, number] | null) => void;
  dispatched: boolean;
  setDispatched: (d: boolean) => void;
  userLocation: [number, number];
  setDispatchData?: (d: any) => void;
}

export default function DispatchTab({ setPickupLocation, dispatched, setDispatched, userLocation, setDispatchData }: Props) {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [unitType, setUnitType] = useState<'BLS' | 'ALS'>('BLS');
  const [searching, setSearching] = useState(false);
  const [autoLocating, setAutoLocating] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Check initial status
    setIsOffline(!navigator.onLine);

    // Listen for network changes
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDispatch = async () => {
    setDispatching(true);
    
    if (isOffline || !navigator.onLine) {
      // Offline SMS Fallback
      const message = encodeURIComponent(
        `AEROCARE EMERGENCY: Need ${unitType} ambulance immediately.\n` +
        `Location: ${pickup || 'Current Location'}\n` +
        `Coordinates: ${userLocation[0]}, ${userLocation[1]}\n` +
        `Destination: ${destination || 'Nearest Hospital'}`
      );
      // Open native SMS app (112 is the universal emergency number in India/EU)
      window.location.href = `sms:112?body=${message}`;
      setDispatched(true);
      setDispatching(false);
      return;
    }

    try {
      const res = await dispatchAmbulance(userLocation[0], userLocation[1], unitType);
      // Backend called successfully (or mock fallback returned)
      if (res.data && setDispatchData) {
        setDispatchData(res.data);
      }
      setDispatched(true);
    } catch (err) {
      console.error('Dispatch error:', err);
      // Fallback
      setDispatched(true);
    }
    setDispatching(false);
  };

  // Auto detect user location address on mount
  useEffect(() => {
    let isMounted = true;
    const fetchAddress = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation[0]}&lon=${userLocation[1]}`
        );
        const data = await res.json();
        if (isMounted && data && data.display_name) {
          // Shorten address to something readable
          const addressParts = data.display_name.split(', ');
          const shortAddress = addressParts.slice(0, 3).join(', ');
          setPickup(shortAddress);
          setPickupLocation(userLocation);
        } else if (isMounted) {
          setPickup('Current Location');
        }
      } catch (err) {
        if (isMounted) setPickup('Current Location');
      }
      if (isMounted) setAutoLocating(false);
    };
    
    if (userLocation) {
      fetchAddress();
    }
  }, [userLocation, setPickupLocation]);

  const geocode = async (query: string) => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`,
      );
      const data = await res.json();
      if (data?.length > 0) {
        setPickupLocation([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      }
    } catch (err) {
      console.error('Geocode error:', err);
    }
    setSearching(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Header ── */}
      <div>
        <h2 className="text-[1.65rem] font-extrabold tracking-tight leading-tight">
          Request Emergency
        </h2>
        <p className="text-sm text-gray-400 font-medium mt-1">Dispatch an ambulance to your location</p>
      </div>

      {/* ── Uber-style location track ── */}
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-[13px] top-[18px] w-[2px] h-[calc(100%-36px)] bg-gray-200" />

        {/* Pickup dot */}
        <div className="absolute left-[6px] top-[14px]">
          <div className="w-4 h-4 bg-black rounded-full border-[3px] border-white shadow-sm" />
        </div>

        {/* Destination dot */}
        <div className="absolute left-[6px] bottom-[14px]">
          <div className="w-4 h-4 bg-red-500 rounded-sm border-[3px] border-white shadow-sm" />
        </div>

        <div className="flex flex-col gap-3">
          {/* Pickup */}
          <div className="input-ring flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl overflow-hidden">
            <input
              type="text"
              placeholder="Pickup location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && geocode(pickup)}
              className="flex-1 bg-transparent px-4 py-3.5 text-sm font-medium placeholder:text-gray-300"
            />
            <button
              onClick={() => geocode(pickup)}
              disabled={searching}
              className="px-3 py-2 mr-1 text-gray-400 hover:text-black transition-colors disabled:opacity-40"
            >
              {searching || autoLocating ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Search className="w-4 h-4" />}
            </button>
          </div>

          {/* Destination */}
          <div className="input-ring flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl overflow-hidden relative">
            <input
              type="text"
              placeholder="Hospital / Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1 bg-transparent px-4 py-3.5 text-sm font-medium placeholder:text-gray-300"
            />
            {destination === '' && (
              <button 
                onClick={() => setDestination('Nearest Recommended Hospital')}
                className="absolute right-12 flex items-center gap-1 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-bold border border-indigo-100 shadow-sm"
              >
                <Sparkles className="w-3 h-3" /> AI Find
              </button>
            )}
            <button className="px-3 py-2 mr-1 text-gray-400 hover:text-black transition-colors">
              <Navigation className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Unit Type ── */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Unit Type</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => setUnitType('BLS')}
            className={`p-4 border-2 rounded-2xl flex flex-col items-start gap-0.5 transition-all ${
              unitType === 'BLS'
                ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <Shield className={`w-5 h-5 mb-1 ${unitType === 'BLS' ? 'text-blue-200' : 'text-blue-400'}`} />
            <span className="font-extrabold text-lg">BLS</span>
            <span className={`text-[11px] font-medium ${unitType === 'BLS' ? 'text-blue-200' : 'text-gray-400'}`}>
              Basic Life Support
            </span>
            <span className="text-sm font-bold mt-1">₹800</span>
          </button>
          <button
            onClick={() => setUnitType('ALS')}
            className={`p-4 border-2 rounded-2xl flex flex-col items-start gap-0.5 transition-all ${
              unitType === 'ALS'
                ? 'border-red-500 bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <Zap className={`w-5 h-5 mb-1 ${unitType === 'ALS' ? 'text-red-200' : 'text-red-400'}`} />
            <span className="font-extrabold text-lg">ALS</span>
            <span className={`text-[11px] font-medium ${unitType === 'ALS' ? 'text-red-200' : 'text-gray-400'}`}>
              Advanced Life Support
            </span>
            <span className="text-sm font-bold mt-1">₹1,500</span>
          </button>
        </div>
      </div>

      {/* ── Dispatch CTA ── */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleDispatch}
        disabled={dispatching}
        className={`w-full text-white py-4 rounded-2xl font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-80 ${
          isOffline ? 'bg-orange-600' : 'bg-black'
        }`}
      >
        {dispatching ? <Loader2 className="w-5 h-5 animate-spin" /> : <CircleDot className="w-5 h-5" />}
        {dispatching ? 'Dispatching...' : isOffline ? 'Send Emergency SMS (Offline)' : 'See Available Units'}
      </motion.button>
    </div>
  );
}
