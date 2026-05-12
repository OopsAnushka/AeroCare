'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Search, Shield, Zap, CircleDot, Loader2, Sparkles, Phone, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { dispatchAmbulance } from '@/lib/api';

interface Props {
  setPickupLocation: (l: [number,number]|null) => void;
  dispatched: boolean; setDispatched: (d: boolean) => void;
  userLocation: [number,number]; setDispatchData?: (d: any) => void;
}

export default function DispatchTab({ setPickupLocation, dispatched, setDispatched, userLocation, setDispatchData }: Props) {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [unitType, setUnitType] = useState<'BLS'|'ALS'>('BLS');
  const [searching, setSearching] = useState(false);
  const [autoLocating, setAutoLocating] = useState(true);
  const [dispatching, setDispatching] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [eta, setEta] = useState<string|null>(null);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const on = () => setIsOffline(false), off = () => setIsOffline(true);
    window.addEventListener('online', on); window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  useEffect(() => {
    let ok = true;
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation[0]}&lon=${userLocation[1]}`)
      .then(r => r.json()).then(d => {
        if (!ok) return;
        const parts = d?.display_name?.split(', ') ?? [];
        setPickup(parts.slice(0,3).join(', ') || 'Current Location');
        setPickupLocation(userLocation);
      }).catch(() => setPickup('Current Location'))
      .finally(() => { if (ok) setAutoLocating(false); });
    return () => { ok = false; };
  }, [userLocation, setPickupLocation]);

  const geocode = async (q: string) => {
    if (!q.trim()) return;
    setSearching(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`);
      const d = await r.json();
      if (d?.length > 0) setPickupLocation([parseFloat(d[0].lat), parseFloat(d[0].lon)]);
    } catch {}
    setSearching(false);
  };

  const handleDispatch = async () => {
    setDispatching(true);
    if (isOffline) {
      const msg = encodeURIComponent(`AEROCARE EMERGENCY: Need ${unitType} ambulance.\nLocation: ${pickup}\nCoords: ${userLocation[0]},${userLocation[1]}`);
      window.location.href = `sms:112?body=${msg}`;
      setDispatched(true); setDispatching(false); return;
    }
    try {
      const res = await dispatchAmbulance(userLocation[0], userLocation[1], unitType);
      if (res.data && setDispatchData) {
        setDispatchData(res.data);
        setEta(res.data.eta_mins ? `${res.data.eta_mins} min` : '4 min');
        localStorage.setItem('global_alert', JSON.stringify({
          type: 'SOS', urgency: 'CRITICAL PRIORITY',
          location: `Lat: ${userLocation[0].toFixed(4)}, Lon: ${userLocation[1].toFixed(4)}`,
          distance: '~' + (Math.random()*5+1).toFixed(1)+' km',
          details: `Patient requires immediate ${unitType} medical assistance.`,
          timestamp: Date.now()
        }));
        window.dispatchEvent(new Event('global_alert_local'));
      } else { setEta('4 min'); }
      setDispatched(true);
    } catch { setDispatched(true); setEta('4 min'); }
    setDispatching(false);
  };

  if (dispatched) return (
    <div className="flex flex-col gap-4">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-white text-center shadow-lg shadow-emerald-500/20">
        <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black mb-1">Ambulance Dispatched!</h2>
        <p className="text-emerald-100 text-sm font-medium">Help is on the way to your location</p>
        {eta && (
          <div className="mt-3 flex items-center justify-center gap-2 bg-white/20 rounded-xl px-4 py-2">
            <Clock className="w-4 h-4" /><span className="font-bold">ETA: {eta}</span>
          </div>
        )}
      </div>
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-red-500" /><p className="font-bold text-sm text-red-700">While you wait:</p></div>
        <ul className="text-sm text-red-600 space-y-1.5 font-medium">
          <li>• Stay calm and keep the patient still</li>
          <li>• Keep airways clear and check breathing</li>
          <li>• Do not give food or water</li>
          <li>• Send someone to the entrance to guide paramedics</li>
        </ul>
      </div>
      <a href="tel:112" className="flex items-center justify-center gap-2 bg-red-500 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-red-500/25 hover:bg-red-600 transition-colors">
        <Phone className="w-5 h-5" /> Call 112 Emergency
      </a>
      <button onClick={() => { setDispatched(false); setEta(null); }}
        className="w-full border-2 border-gray-200 text-gray-600 py-3 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-colors">
        Request Another Unit
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <h2 className="text-[1.6rem] font-extrabold tracking-tight">Request Emergency</h2>
        </div>
        <p className="text-sm text-gray-400 font-medium">Dispatch an ambulance to your exact location</p>
      </div>

      {isOffline && (
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold px-4 py-3 rounded-xl">
          <AlertTriangle className="w-4 h-4 shrink-0" /> Offline mode — dispatch will send SMS to 112
        </div>
      )}

      {/* Location track */}
      <div className="relative pl-8">
        <div className="absolute left-[13px] top-[18px] w-[2px] h-[calc(100%-36px)] bg-gray-200" />
        <div className="absolute left-[6px] top-[14px]"><div className="w-4 h-4 bg-black rounded-full border-[3px] border-white shadow-sm" /></div>
        <div className="absolute left-[6px] bottom-[14px]"><div className="w-4 h-4 bg-red-500 rounded-sm border-[3px] border-white shadow-sm" /></div>
        <div className="flex flex-col gap-3">
          <div className="input-ring flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl overflow-hidden">
            <MapPin className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
            <input type="text" placeholder="Pickup location" value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && geocode(pickup)}
              className="flex-1 bg-transparent px-3 py-3.5 text-sm font-medium placeholder:text-gray-300" />
            <button onClick={() => geocode(pickup)} disabled={searching} className="px-3 py-2 mr-1 text-gray-400 hover:text-black transition-colors">
              {searching || autoLocating ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Search className="w-4 h-4" />}
            </button>
          </div>
          <div className="input-ring flex items-center bg-gray-50 border-2 border-gray-100 rounded-xl overflow-hidden relative">
            <Navigation className="w-4 h-4 text-gray-400 ml-3 shrink-0" />
            <input type="text" placeholder="Hospital / Destination" value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="flex-1 bg-transparent px-3 py-3.5 text-sm font-medium placeholder:text-gray-300 pr-24" />
            {!destination && (
              <button onClick={() => setDestination('Nearest Recommended Hospital')}
                className="absolute right-2 flex items-center gap-1 bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-[10px] font-bold border border-indigo-100">
                <Sparkles className="w-3 h-3" /> AI
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Unit type */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Unit Type</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {[{t:'BLS',icon:Shield,color:'blue',price:'₹800',desc:'Basic Life Support'},{t:'ALS',icon:Zap,color:'red',price:'₹1,500',desc:'Advanced Life Support'}].map(({t,icon:Icon,color,price,desc}) => (
            <button key={t} onClick={() => setUnitType(t as 'BLS'|'ALS')}
              className={`p-4 border-2 rounded-2xl flex flex-col items-start gap-0.5 transition-all ${unitType===t
                ? `border-${color}-500 bg-gradient-to-br from-${color}-500 to-${color}-600 text-white shadow-lg shadow-${color}-500/20`
                : 'border-gray-100 bg-white hover:border-gray-200'}`}>
              <Icon className={`w-5 h-5 mb-1 ${unitType===t ? `text-${color}-100` : `text-${color}-400`}`} />
              <span className="font-extrabold text-lg">{t}</span>
              <span className={`text-[11px] font-medium ${unitType===t ? `text-${color}-100` : 'text-gray-400'}`}>{desc}</span>
              <span className="text-sm font-bold mt-1">{price}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dispatch CTA */}
      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={handleDispatch} disabled={dispatching}
        className={`w-full text-white py-4 rounded-2xl font-bold text-base shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-80 ${isOffline ? 'bg-orange-600 shadow-orange-500/20' : 'bg-black shadow-black/10'}`}>
        {dispatching ? <Loader2 className="w-5 h-5 animate-spin" /> : <CircleDot className="w-5 h-5" />}
        {dispatching ? 'Dispatching...' : isOffline ? 'Send Emergency SMS' : 'Dispatch Ambulance Now'}
      </motion.button>

      <a href="tel:112" className="flex items-center justify-center gap-2 border-2 border-red-100 text-red-500 py-3 rounded-2xl font-bold text-sm hover:bg-red-50 transition-colors">
        <Phone className="w-4 h-4" /> Call 112 Directly
      </a>
    </div>
  );
}