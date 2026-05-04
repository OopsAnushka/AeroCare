'use client';
import { motion } from 'framer-motion';
import { Phone, Share2, Star, User, X, Ambulance } from 'lucide-react';

interface Props {
  onClose: () => void;
  dispatchData?: any;
}

export default function LiveTracker({ onClose, dispatchData }: Props) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="fixed bottom-0 left-0 w-full md:w-[420px] md:left-4 md:bottom-4 z-[500] bg-white rounded-t-[1.75rem] md:rounded-[1.75rem] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] md:shadow-[0_12px_48px_-8px_rgba(0,0,0,0.2)] border border-gray-100 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-black text-white px-6 py-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-1">
            {dispatchData?.hospitalName ? `Dispatched from ${dispatchData.hospitalName}` : 'ALS Unit En Route'}
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            {dispatchData?.eta || '4 min'}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"
            />
          </h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-6 py-5 flex flex-col gap-5">
        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute top-[7px] left-0 right-0 h-[3px] bg-gray-100 rounded-full" />
          <div className="absolute top-[7px] left-0 w-[60%] h-[3px] bg-black rounded-full transition-all duration-1000" />
          <div className="relative flex justify-between">
            {['Dispatched', 'Arriving', 'Here'].map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-1.5">
                <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${i < 2 ? 'bg-black' : 'bg-gray-200'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-wider ${i < 2 ? 'text-black' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Driver card */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
            <User className="w-7 h-7 text-gray-400" />
          </div>
          <div className="grow min-w-0">
            <h3 className="font-bold text-lg truncate">Dr. Rajesh Kumar</h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              4.9
              <span className="text-gray-300 mx-1">•</span>
              Senior Paramedic
            </div>
          </div>
          <div className="bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5">
            <Ambulance className="w-3.5 h-3.5" />
            {dispatchData?.unitId || 'MP09-1234'}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-gray-900 transition-colors shadow-md">
            <Phone className="w-4 h-4 fill-current" />
            Call Paramedic
          </button>
          <button className="flex-1 bg-white text-black py-3.5 rounded-xl font-bold border-2 border-gray-200 flex items-center justify-center gap-2 text-sm hover:border-black transition-colors">
            <Share2 className="w-4 h-4" />
            Share Live Status
          </button>
        </div>
      </div>
    </motion.div>
  );
}
