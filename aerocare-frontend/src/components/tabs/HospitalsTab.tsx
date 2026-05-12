'use client';
import { useState } from 'react';
import { Navigation, Sparkles, BedDouble, Clock, Phone, ExternalLink } from 'lucide-react';
import type { HospitalData } from '@/app/emergency/EmergencyClient';

interface Props { userLocation:[number,number]; hospitals:HospitalData[]; setHospitalRoute:(r:[number,number][]|null)=>void; }

export default function HospitalsTab({ userLocation, hospitals, setHospitalRoute }: Props) {
  const [routingId, setRoutingId] = useState<number|null>(null);

  const getAiScore = (h: HospitalData) => {
    const dist = parseFloat(h.distance) || 10;
    return (h.beds * 10) - (dist * 5);
  };
  const sorted = [...hospitals].sort((a,b) => getAiScore(b) - getAiScore(a));
  const topId = sorted[0]?.id;

  const drawRoute = async (h: HospitalData) => {
    setRoutingId(h.id as number);
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${h.pos[1]},${h.pos[0]}?geometries=geojson`);
      const data = await res.json();
      if (data.routes?.[0]) {
        setHospitalRoute(data.routes[0].geometry.coordinates.map((c:[number,number]) => [c[1],c[0]]));
      } else setHospitalRoute([userLocation, h.pos]);
    } catch { setHospitalRoute([userLocation, h.pos]); }
    setRoutingId(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[1.6rem] font-extrabold tracking-tight">Nearby Hospitals</h2>
        <p className="text-sm text-gray-400 font-medium mt-1">Real-time ICU bed availability near you</p>
      </div>

      {hospitals.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <BedDouble className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-bold text-sm">No hospitals found nearby</p>
          <p className="text-xs mt-1">Searching within 50 km radius</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((h, idx) => (
            <div key={h.id} className={`rounded-2xl border p-4 transition-shadow hover:shadow-md ${idx===0 ? 'border-indigo-200 bg-indigo-50/50' : 'border-gray-100 bg-white'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0 mr-2">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-bold text-base leading-tight">{h.name}</h4>
                    {h.id === topId && (
                      <span className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                        <Sparkles className="w-2.5 h-2.5" /> Best Match
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{h.distance} away</span>
                  </div>
                </div>
                <div className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl text-center ${h.beds > 2 ? 'bg-emerald-50 text-emerald-600' : h.beds > 0 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-600'}`}>
                  <span className="text-lg font-black leading-none">{h.beds}</span>
                  <span className="text-[9px] font-bold uppercase tracking-wider leading-none mt-0.5">ICU Beds</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => drawRoute(h)} disabled={routingId === h.id}
                  className="flex-1 bg-black text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors disabled:opacity-60">
                  {routingId === h.id ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Navigation className="w-4 h-4" />}
                  {routingId === h.id ? 'Routing...' : 'Get Route'}
                </button>
                <a href="tel:112" className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl font-bold text-sm border border-red-100 hover:bg-red-100 transition-colors">
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}