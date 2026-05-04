'use client';
import { ShieldCheck, Megaphone } from 'lucide-react';
import type { Volunteer } from '@/app/emergency/EmergencyClient';

export default function RadarTab({ volunteers }: { volunteers: Volunteer[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[1.65rem] font-extrabold tracking-tight leading-tight">Samaritan Radar</h2>
        <p className="text-sm text-gray-400 font-medium mt-1">
          Nearby CPR-certified civilian volunteers are marked on the map.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {volunteers.map((v) => (
          <div
            key={v.id}
            className="flex items-center p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mr-3.5 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="grow min-w-0">
              <h4 className="font-bold truncate">{v.name}</h4>
              <p className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider mt-0.5">{v.cert}</p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="font-bold text-lg leading-tight">{v.eta}</p>
              <p className="text-[11px] text-gray-400 font-medium">{v.distance}</p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => alert('Emergency Ping sent to all nearby CPR-certified volunteers. They have been notified!')}
        className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors shadow-md"
      >
        <Megaphone className="w-4 h-4" />
        Ping All Volunteers
      </button>
    </div>
  );
}
