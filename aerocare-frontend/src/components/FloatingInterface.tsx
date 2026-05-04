'use client';
import { motion } from 'framer-motion';
import type { TabId, Volunteer, HospitalData } from '@/app/emergency/EmergencyClient';
import { Ambulance, Radar, Hospital, Droplet, HeartPulse } from 'lucide-react';
import DispatchTab from './tabs/DispatchTab';
import RadarTab from './tabs/RadarTab';
import HospitalsTab from './tabs/HospitalsTab';
import BloodDonorsTab from './tabs/BloodDonorsTab';
import CPRMetronomeTab from './tabs/CPRMetronomeTab';
import LiveTracker from './LiveTracker';

const TABS: { id: TabId; icon: typeof Ambulance; label: string; gradient: string }[] = [
  { id: 'dispatch', icon: Ambulance, label: 'SOS', gradient: 'from-red-500 to-rose-600' },
  { id: 'radar', icon: Radar, label: 'Radar', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'hospitals', icon: Hospital, label: 'Hospitals', gradient: 'from-blue-500 to-indigo-600' },
  { id: 'blood', icon: Droplet, label: 'Blood', gradient: 'from-pink-500 to-rose-600' },
  { id: 'cpr', icon: HeartPulse, label: 'CPR', gradient: 'from-amber-500 to-orange-600' },
];

interface Props {
  activeTab: TabId;
  setActiveTab: (t: TabId) => void;
  setPickupLocation: (l: [number, number] | null) => void;
  setHospitalRoute: (r: [number, number][] | null) => void;
  userLocation: [number, number];
  volunteers: Volunteer[];
  hospitals: HospitalData[];
  dispatched: boolean;
  setDispatched: (d: boolean) => void;
  dispatchData?: any;
  setDispatchData?: (d: any) => void;
}

export default function FloatingInterface({
  activeTab,
  setActiveTab,
  setPickupLocation,
  setHospitalRoute,
  userLocation,
  volunteers,
  hospitals,
  dispatched,
  setDispatched,
  dispatchData,
  setDispatchData,
}: Props) {
  return (
    <>
      {/* ── Floating Panel ── */}
      <motion.div
        className="absolute bottom-0 left-0 w-full md:w-[420px] md:top-4 md:left-4 md:bottom-auto z-[400] flex flex-col rounded-t-[1.75rem] md:rounded-[1.75rem] shadow-[0_-8px_40px_rgba(0,0,0,0.1)] md:shadow-[0_12px_48px_-8px_rgba(0,0,0,0.15)]"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.15}
      >
        {/* Drag handle — mobile only */}
        <div className="md:hidden flex justify-center pt-3 pb-1 bg-white rounded-t-[1.75rem]">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="bg-white md:rounded-[1.75rem] overflow-hidden flex flex-col max-h-[82vh] md:max-h-[calc(100vh-100px)] border border-gray-100/60">
          {/* ── Tab bar ── */}
          <div className="flex overflow-x-auto p-2.5 gap-1.5 shrink-0 hide-scrollbar bg-gray-50/60 border-b border-gray-100">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center min-w-[70px] h-[68px] rounded-2xl transition-colors shrink-0 ${
                    active ? 'text-white' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="tab-bg"
                      className={`absolute inset-0 bg-gradient-to-br ${tab.gradient} rounded-2xl shadow-lg`}
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.55 }}
                    />
                  )}
                  <tab.icon className="w-5 h-5 mb-1 relative z-10" />
                  <span className="text-[10px] font-bold uppercase tracking-wider relative z-10">
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Tab content ── */}
          <div className="p-5 overflow-y-auto grow">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dispatch' && (
                  <DispatchTab
                  setPickupLocation={setPickupLocation}
                  dispatched={dispatched}
                  setDispatched={setDispatched}
                  userLocation={userLocation}
                  setDispatchData={setDispatchData}
                />
              )}
              {activeTab === 'radar' && <RadarTab volunteers={volunteers} />}
              {activeTab === 'hospitals' && (
                <HospitalsTab
                  userLocation={userLocation}
                  hospitals={hospitals}
                  setHospitalRoute={setHospitalRoute}
                />
              )}
              {activeTab === 'blood' && <BloodDonorsTab userLocation={userLocation} />}
              {activeTab === 'cpr' && <CPRMetronomeTab />}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Live Tracker overlay (shown post-dispatch) ── */}
      {dispatched && <LiveTracker onClose={() => setDispatched(false)} dispatchData={dispatchData} />}
    </>
  );
}
