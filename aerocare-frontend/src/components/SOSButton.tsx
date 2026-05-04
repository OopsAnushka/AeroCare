'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Ambulance, X, MapPin, Check, Wifi } from 'lucide-react';

export default function SOSButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [userLoc, setUserLoc] = useState<{ lat: number; lon: number } | null>(null);

  // Hide on emergency page (it has its own dispatch)
  const isEmergencyPage = pathname === '/emergency';

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLoc({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => setUserLoc({ lat: 22.7196, lon: 75.8577 }),
    );
  }, []);

  const sendAlert = () => {
    setSending(true);
    // Simulate alert broadcast to all ambulances within 10km
    setTimeout(() => {
      setSending(false);
      setSent(true);
      // Vibrate for haptic feedback on mobile
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
      setTimeout(() => { setSent(false); setOpen(false); }, 3000);
    }, 2000);
  };

  if (isEmergencyPage) return null;

  return (
    <>
      {/* ── Floating SOS Button ── */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[900] w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full shadow-[0_6px_24px_rgba(239,68,68,0.4)] flex items-center justify-center glow-pulse hover:shadow-[0_8px_32px_rgba(239,68,68,0.5)] transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="SOS Emergency Alert"
      >
        <Ambulance className="w-6 h-6 md:w-7 md:h-7" />
      </motion.button>

      {/* ── SOS Modal ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[950] flex items-end sm:items-center justify-center p-4"
            onClick={() => !sending && setOpen(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              className="bg-white w-full max-w-sm rounded-[1.75rem] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-5 text-white relative">
                <button onClick={() => !sending && setOpen(false)} className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Ambulance className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg">Emergency SOS</h3>
                    <p className="text-xs text-red-100 font-medium">Broadcast to all units within 10 km</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 py-5 flex flex-col gap-4">
                {/* Location */}
                <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  <div className="w-9 h-9 bg-red-50 text-red-500 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Location</p>
                    <p className="text-sm font-bold truncate">
                      {userLoc ? `${userLoc.lat.toFixed(4)}°N, ${userLoc.lon.toFixed(4)}°E` : 'Detecting...'}
                    </p>
                  </div>
                </div>

                {/* Range info */}
                <div className="flex items-center gap-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                  <div className="w-9 h-9 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Broadcast Range</p>
                    <p className="text-sm font-bold">10 km radius — all available units</p>
                  </div>
                </div>

                {/* Alert text */}
                <p className="text-xs text-gray-400 text-center font-medium leading-relaxed">
                  This will alert <strong className="text-gray-600">all ambulances</strong> within 10 km of your location. The nearest available unit will be dispatched immediately.
                </p>

                {/* Action button */}
                <motion.button
                  onClick={sendAlert}
                  disabled={sending || sent}
                  whileHover={!sending && !sent ? { scale: 1.02 } : {}}
                  whileTap={!sending && !sent ? { scale: 0.98 } : {}}
                  className={`w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                    sent
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-black text-white shadow-lg shadow-black/20 hover:bg-gray-900'
                  }`}
                >
                  {sending ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                      Broadcasting Alert...
                    </>
                  ) : sent ? (
                    <>
                      <Check className="w-5 h-5" />
                      Alert Sent — Help is coming!
                    </>
                  ) : (
                    <>
                      <Ambulance className="w-5 h-5" />
                      Send Emergency Alert
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
