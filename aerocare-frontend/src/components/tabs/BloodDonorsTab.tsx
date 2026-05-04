'use client';
import { useState, useEffect } from 'react';
import { Droplet, Loader2 } from 'lucide-react';
import { fetchNearbyDonors } from '@/lib/api';

interface DonorData {
  id: number;
  name: string;
  blood: string;
  distance: string;
  eta: string;
}

export default function BloodDonorsTab({ userLocation }: { userLocation: [number, number] }) {
  const [donors, setDonors] = useState<DonorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDonors() {
      setLoading(true);
      try {
        // Default to asking for O- for now, or match user profile blood type if available
        const data = await fetchNearbyDonors(userLocation[0], userLocation[1], 'O-');
        setDonors(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    if (userLocation) loadDonors();
  }, [userLocation]);
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[1.65rem] font-extrabold tracking-tight leading-tight">Blood Donors</h2>
        <p className="text-sm text-gray-400 font-medium mt-1">Nearby donors matching required types</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : donors.map((d) => (
          <div
            key={d.id}
            className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className="w-11 h-11 bg-red-50 text-red-500 rounded-full flex items-center justify-center mr-3.5 shrink-0 font-extrabold text-sm">
              {d.blood}
            </div>
            <div className="grow min-w-0">
              <h4 className="font-bold truncate">{d.name}</h4>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                {d.distance} away
              </p>
            </div>
            <button 
              onClick={() => alert(`Direct request sent to ${d.name}. Waiting for confirmation.`)}
              className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors shadow-sm shrink-0 ml-3"
            >
              Request
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => alert('Blood emergency broadcasted to all compatible donors within a 10km radius!')}
        className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-shadow"
      >
        <Droplet className="w-4 h-4 fill-current" />
        Broadcast Blood Emergency
      </button>
    </div>
  );
}
