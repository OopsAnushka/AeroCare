'use client';
import { useState, useEffect } from 'react';
import { Droplet, Loader2, Filter } from 'lucide-react';
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
  const [filterBloodGroup, setFilterBloodGroup] = useState('O-');
  const [filterDistance, setFilterDistance] = useState(10);

  useEffect(() => {
    async function loadDonors() {
      setLoading(true);
      try {
        const data = await fetchNearbyDonors(userLocation[0], userLocation[1], filterBloodGroup, filterDistance);
        setDonors(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    if (userLocation) loadDonors();
  }, [userLocation, filterBloodGroup, filterDistance]);
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[1.65rem] font-extrabold tracking-tight leading-tight">Blood Donors</h2>
        <p className="text-sm text-gray-400 font-medium mt-1">Nearby donors matching required types</p>
      </div>

      <div className="flex gap-2 mb-2">
        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex items-center gap-2">
          <Droplet className="w-4 h-4 text-red-500" />
          <select value={filterBloodGroup} onChange={(e) => setFilterBloodGroup(e.target.value)} className="bg-transparent text-sm font-bold w-full focus:outline-none">
            <option value="A+">A+</option><option value="A-">A-</option>
            <option value="B+">B+</option><option value="B-">B-</option>
            <option value="AB+">AB+</option><option value="AB-">AB-</option>
            <option value="O+">O+</option><option value="O-">O-</option>
          </select>
        </div>
        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select value={filterDistance} onChange={(e) => setFilterDistance(Number(e.target.value))} className="bg-transparent text-sm font-bold w-full focus:outline-none text-gray-600">
            <option value={5}>Within 5 km</option>
            <option value={10}>Within 10 km</option>
            <option value={20}>Within 20 km</option>
            <option value={50}>Within 50 km</option>
          </select>
        </div>
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
        onClick={() => {
          localStorage.setItem('global_alert', JSON.stringify({
            type: 'BLOOD',
            urgency: 'IMMEDIATE REQUIREMENT',
            location: 'Local Region',
            distance: '~' + filterDistance + ' km',
            details: `A patient urgently requires ${filterBloodGroup === 'O-' ? 'Universal O-' : filterBloodGroup} blood. Please accept to get directions to the hospital.`,
            timestamp: Date.now()
          }));
          window.dispatchEvent(new Event('global_alert_local'));
          alert(`Blood emergency broadcasted to all compatible donors within a ${filterDistance}km radius!`);
        }}
        className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-shadow"
      >
        <Droplet className="w-4 h-4 fill-current" />
        Broadcast Blood Emergency
      </button>
    </div>
  );
}
