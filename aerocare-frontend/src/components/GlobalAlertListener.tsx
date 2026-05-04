'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, MapPin, PhoneCall, Droplet } from 'lucide-react';

export default function GlobalAlertListener() {
  const { profile } = useAuth();
  const [alertData, setAlertData] = useState<any>(null);

  useEffect(() => {
    // Only listen if user is a responder role
    if (!profile || !['ambulance_driver', 'donor', 'civilian'].includes(profile.role)) return;

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'global_alert' && e.newValue) {
        const data = JSON.parse(e.newValue);
        
        // Filter logic:
        // - Ambulance drivers see SOS alerts.
        // - Donors see Blood requests.
        // - Civilians see Radar requests (or SOS nearby).
        
        if (data.type === 'SOS' && profile.role === 'ambulance_driver') {
          triggerAlert(data);
        } else if (data.type === 'BLOOD' && profile.role === 'donor') {
          // If blood group matches or broad request
          triggerAlert(data);
        } else if (data.type === 'RADAR' && profile.role === 'civilian') {
          triggerAlert(data);
        }
      }
    };

    const handleLocalEvent = () => {
      const val = localStorage.getItem('global_alert');
      if (val) handleStorageEvent({ key: 'global_alert', newValue: val } as any);
    };

    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener('global_alert_local', handleLocalEvent);
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('global_alert_local', handleLocalEvent);
    };
  }, [profile]);

  const triggerAlert = (data: any) => {
    setAlertData(data);
    
    // Web Vibration API (Works on Android/compatible devices)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([500, 200, 500, 200, 1000]); // SOS pattern
    }
    
    // Play loud notification sound
    const audio = new Audio('/alert-sound.mp3'); // Fallback if no file exists
    audio.play().catch(e => console.log('Audio autoplay blocked', e));
  };

  const acceptRequest = () => {
    // Mock acceptance
    alert('You have accepted this request. Your ETA is being transmitted.');
    setAlertData(null);
  };

  return (
    <AnimatePresence>
      {alertData && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`w-full max-w-md rounded-3xl p-6 shadow-2xl border-4 ${
              alertData.type === 'BLOOD' ? 'bg-red-900 border-red-500 text-white' : 'bg-red-600 border-white text-white'
            }`}
          >
            <div className="flex justify-center mb-4">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                {alertData.type === 'BLOOD' ? <Droplet className="w-8 h-8 text-red-600" /> : <AlertTriangle className="w-8 h-8 text-red-600" />}
              </motion.div>
            </div>
            
            <h2 className="text-3xl font-black text-center uppercase tracking-widest mb-1">
              {alertData.type === 'BLOOD' ? 'EMERGENCY BLOOD REQUIRED' : 'EMERGENCY DISPATCH'}
            </h2>
            <p className="text-center font-bold text-red-200 mb-6 uppercase tracking-wider">{alertData.urgency || 'CRITICAL PRIORITY'}</p>

            <div className="bg-black/20 rounded-2xl p-5 mb-6 backdrop-blur-sm">
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 mt-0.5 text-white/70 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white/50 uppercase tracking-wider">Location</p>
                  <p className="font-bold">{alertData.location || 'Unknown Location'}</p>
                  <p className="text-sm font-medium text-white/70">Distance: ~{alertData.distance || '2.4 km'}</p>
                </div>
              </div>
              {alertData.details && (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <p className="text-sm font-medium leading-relaxed">{alertData.details}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setAlertData(null)} className="flex-1 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-colors">
                DECLINE
              </button>
              <button onClick={acceptRequest} className="flex-[2] py-4 bg-white text-red-600 rounded-2xl font-black text-lg hover:bg-gray-100 transition-colors shadow-xl">
                ACCEPT & RESPOND
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
