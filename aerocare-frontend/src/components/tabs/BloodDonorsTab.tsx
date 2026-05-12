'use client';
import { useState, useEffect } from 'react';
import { Droplet, Loader2, Filter, Phone, AlertTriangle, Users } from 'lucide-react';
import { fetchNearbyDonors } from '@/lib/api';

interface DonorData { id: number; name: string; blood: string; distance: string; eta: string; }

export default function BloodDonorsTab({ userLocation }: { userLocation:[number,number] }) {
  const [donors, setDonors] = useState<DonorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBloodGroup, setFilterBloodGroup] = useState('O-');
  const [filterDistance, setFilterDistance] = useState(10);
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcastDone, setBroadcastDone] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try { setDonors(await fetchNearbyDonors(userLocation[0],userLocation[1],filterBloodGroup,filterDistance)); }
      catch {}
      setLoading(false);
    }
    if (userLocation) load();
  }, [userLocation, filterBloodGroup, filterDistance]);

  const handleBroadcast = () => {
    setBroadcasting(true);
    localStorage.setItem('global_alert', JSON.stringify({
      type: 'BLOOD', urgency: 'IMMEDIATE REQUIREMENT', location: 'Local Region',
      distance: `~${filterDistance} km`,
      details: `A patient urgently requires ${filterBloodGroup} blood. Please accept to get directions.`,
      timestamp: Date.now()
    }));
    window.dispatchEvent(new Event('global_alert_local'));
    setTimeout(() => { setBroadcasting(false); setBroadcastDone(true); setTimeout(() => setBroadcastDone(false), 4000); }, 1200);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[1.6rem] font-extrabold tracking-tight">Blood Donors</h2>
        <p className="text-sm text-gray-400 font-medium mt-1">Nearby donors matching your blood type</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex items-center gap-2">
          <Droplet className="w-4 h-4 text-red-500 shrink-0" />
          <select value={filterBloodGroup} onChange={(e)=>setFilterBloodGroup(e.target.value)} className="bg-transparent text-sm font-bold w-full focus:outline-none">
            {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g=><option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <select value={filterDistance} onChange={(e)=>setFilterDistance(Number(e.target.value))} className="bg-transparent text-sm font-bold w-full focus:outline-none text-gray-600">
            {[5,10,20,50].map(d=><option key={d} value={d}>Within {d}km</option>)}
          </select>
        </div>
      </div>

      {/* Donors list */}
      <div className="flex flex-col gap-2.5">
        {loading ? (
          <div className="flex flex-col items-center py-10 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            <p className="text-sm text-gray-400 font-medium">Searching donors...</p>
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-bold text-sm">No donors found nearby</p>
            <p className="text-xs mt-1">Try increasing the radius or broadcast an alert</p>
          </div>
        ) : donors.map((d) => (
          <div key={d.id} className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-full flex items-center justify-center mr-3.5 shrink-0 font-black text-sm shadow-md shadow-red-500/20">
              {d.blood}
            </div>
            <div className="grow min-w-0">
              <h4 className="font-bold truncate">{d.name}</h4>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{d.distance} · ETA {d.eta}</p>
            </div>
            <button onClick={() => alert(`Request sent to ${d.name}. Awaiting confirmation.`)}
              className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors shrink-0 ml-2">
              Request
            </button>
          </div>
        ))}
      </div>

      {/* Broadcast */}
      <button onClick={handleBroadcast} disabled={broadcasting}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${broadcastDone ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-gradient-to-r from-red-500 to-rose-600 shadow-red-500/20 hover:shadow-red-500/30'}`}>
        {broadcasting ? <Loader2 className="w-4 h-4 animate-spin" /> : broadcastDone ? '✓ Broadcast Sent!' : <><Droplet className="w-4 h-4 fill-current" />Broadcast Blood Emergency</>}
      </button>
    </div>
  );
}