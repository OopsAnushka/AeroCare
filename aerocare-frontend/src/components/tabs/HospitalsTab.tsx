'use client';
import { Navigation, Sparkles } from 'lucide-react';
import type { HospitalData } from '@/app/emergency/EmergencyClient';

interface Props {
  userLocation: [number, number];
  hospitals: HospitalData[];
  setHospitalRoute: (r: [number, number][] | null) => void;
}

export default function HospitalsTab({ userLocation, hospitals, setHospitalRoute }: Props) {
  const getAiScore = (h: HospitalData) => {
    const distMatch = h.distance.match(/(\d+(\.\d+)?)/);
    const dist = distMatch ? parseFloat(distMatch[1]) : 10;
    return (h.beds * 10) - (dist * 5);
  };

  const sortedHospitals = [...hospitals].sort((a, b) => getAiScore(b) - getAiScore(a));
  const recommendedId = sortedHospitals[0]?.id;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[1.65rem] font-extrabold tracking-tight leading-tight">Nearby Hospitals</h2>
        <p className="text-sm text-gray-400 font-medium mt-1">Real-time ICU bed availability</p>
      </div>

      <div className="flex flex-col gap-3">
        {sortedHospitals.map((h) => (
          <div
            key={h.id}
            className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-base leading-tight">{h.name}</h4>
                  {h.id === recommendedId && (
                    <span className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">
                      <Sparkles className="w-2.5 h-2.5" /> AI Recommended
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                  {h.distance} away
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  h.beds > 2 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                }`}
              >
                {h.beds} ICU Beds
              </span>
            </div>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${h.pos[1]},${h.pos[0]}?geometries=geojson`
                  );
                  const data = await res.json();
                  if (data.routes && data.routes[0]) {
                    // OSRM returns [lon, lat], Leaflet needs [lat, lon]
                    const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
                    setHospitalRoute(coords);
                  } else {
                    setHospitalRoute([userLocation, h.pos]);
                  }
                } catch (err) {
                  console.error('Routing failed, falling back to straight line', err);
                  setHospitalRoute([userLocation, h.pos]);
                }
              }}
              className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              Draw Route
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
