'use client';
import { motion } from 'framer-motion';
import type { TabId, Volunteer, HospitalData } from '@/app/emergency/EmergencyClient';
import { Ambulance, Hospital, Droplet, HeartPulse } from 'lucide-react';
import DispatchTab from './tabs/DispatchTab';
import HospitalsTab from './tabs/HospitalsTab';
import BloodDonorsTab from './tabs/BloodDonorsTab';
import CPRMetronomeTab from './tabs/CPRMetronomeTab';
import LiveTracker from './LiveTracker';

const TABS = [
  { id: 'dispatch'  as TabId, icon: Ambulance,  label: 'SOS',      activeColor: 'from-red-500 to-rose-600',    idleColor: 'text-red-500'   },
  { id: 'hospitals' as TabId, icon: Hospital,   label: 'Hospitals', activeColor: 'from-blue-500 to-indigo-600', idleColor: 'text-blue-500'  },
  { id: 'blood'     as TabId, icon: Droplet,    label: 'Blood',     activeColor: 'from-pink-500 to-rose-600',   idleColor: 'text-pink-500'  },
  { id: 'cpr'       as TabId, icon: HeartPulse, label: 'CPR',       activeColor: 'from-amber-500 to-orange-600',idleColor: 'text-amber-500' },
];

interface Props {
  activeTab: TabId; setActiveTab: (t: TabId) => void;
  setPickupLocation: (l: [number,number]|null) => void;
  setHospitalRoute: (r: [number,number][]|null) => void;
  userLocation: [number,number]; volunteers: Volunteer[]; hospitals: HospitalData[];
  dispatched: boolean; setDispatched: (d: boolean) => void;
  dispatchData?: any; setDispatchData?: (d: any) => void;
}

export default function FloatingInterface({ activeTab, setActiveTab, setPickupLocation,
  setHospitalRoute, userLocation, volunteers, hospitals, dispatched, setDispatched,
  dispatchData, setDispatchData }: Props) {
  return (
    <>
      <div className="absolute bottom-0 left-0 w-full md:relative md:bottom-auto md:left-auto md:w-full md:h-full z-[400] flex flex-col">
        {/* Drag handle mobile */}
        <div className="md:hidden flex justify-center pt-3 pb-2 bg-white rounded-t-[2rem]">
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <div className="bg-white md:rounded-[1.75rem] overflow-hidden flex flex-col max-h-[82vh] md:max-h-full md:h-full shadow-[0_-8px_40px_rgba(0,0,0,0.1)] md:shadow-[0_12px_48px_-8px_rgba(0,0,0,0.2)] border border-gray-100">
          {/* Tab bar */}
          <div className="flex p-2.5 gap-1.5 shrink-0 bg-gray-50/90 border-b border-gray-100 overflow-x-auto hide-scrollbar">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center justify-center flex-1 min-w-[68px] h-[66px] rounded-2xl transition-all duration-200 shrink-0 ${active ? 'text-white' : `${tab.idleColor} hover:bg-gray-100`}`}>
                  {active && (
                    <motion.div layoutId="tab-bg"
                      className={`absolute inset-0 bg-gradient-to-br ${tab.activeColor} rounded-2xl shadow-lg`}
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }} />
                  )}
                  <tab.icon className="w-5 h-5 mb-1 relative z-10" />
                  <span className="text-[10px] font-bold uppercase tracking-wider relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
          {/* Tab content */}
          <div className="p-5 overflow-y-auto grow">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {activeTab === 'dispatch'  && <DispatchTab setPickupLocation={setPickupLocation} dispatched={dispatched} setDispatched={setDispatched} userLocation={userLocation} setDispatchData={setDispatchData} />}
              {activeTab === 'hospitals' && <HospitalsTab userLocation={userLocation} hospitals={hospitals} setHospitalRoute={setHospitalRoute} />}
              {activeTab === 'blood'     && <BloodDonorsTab userLocation={userLocation} />}
              {activeTab === 'cpr'       && <CPRMetronomeTab />}
            </motion.div>
          </div>
        </div>
      </div>
      {dispatched && <LiveTracker onClose={() => setDispatched(false)} dispatchData={dispatchData} />}
    </>
  );
}