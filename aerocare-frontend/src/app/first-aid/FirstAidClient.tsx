'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ChevronLeft, Droplets, Flame, Skull, Hand, HeartPulse, X, Search, Volume2 } from 'lucide-react';
import Link from 'next/link';

const PROTOCOLS = [
  {
    id: 'cpr', title: 'CPR Guide', icon: HeartPulse, bg: 'bg-red-50', text: 'text-red-500',
    steps: ['Check responsiveness — tap shoulders and shout.', 'Call 112 or ask someone nearby to call.', 'Place heel of hand on center of chest, interlock fingers.', 'Push hard and fast: 2 inches deep, 100-120 compressions/min.', 'After 30 compressions, give 2 rescue breaths.', 'Continue until help arrives or an AED is available.'],
  },
  {
    id: 'choking', title: 'Choking', icon: Hand, bg: 'bg-orange-50', text: 'text-orange-500',
    steps: ['Ask "Are you choking?". If they cannot cough or speak, act.', 'Stand behind them, wrap arms around waist.', 'Give 5 sharp back blows between shoulder blades.', 'Give 5 abdominal thrusts (Heimlich) above the navel.', 'Alternate 5 blows and 5 thrusts until cleared.'],
  },
  {
    id: 'bleeding', title: 'Severe Bleeding', icon: Droplets, bg: 'bg-red-50', text: 'text-red-500',
    steps: ['Apply firm direct pressure with a clean cloth.', 'Maintain continuous pressure for at least 5 minutes.', 'If blood soaks through, add layers — do NOT remove the first.', 'Elevate the injured limb above the heart if possible.', 'Apply a tourniquet 2-3 inches above wound if bleeding won\'t stop.'],
  },
  {
    id: 'burns', title: 'Burns', icon: Flame, bg: 'bg-amber-50', text: 'text-amber-500',
    steps: ['Remove person from the heat source immediately.', 'Cool burn under cool (not cold) running water for 10-20 min.', 'Do NOT apply ice, butter, or toothpaste.', 'Cover loosely with a sterile, non-stick bandage.', 'Remove tight clothing/jewelry near burn before swelling.'],
  },
];

export default function FirstAidClient() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const selected = PROTOCOLS.find((p) => p.id === selectedId);
  const filteredProtocols = PROTOCOLS.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.steps.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 w-full bg-gray-50 min-h-screen pb-28">
      <div className="bg-white px-4 sm:px-6 pt-8 sm:pt-10 pb-4 sm:pb-5 sticky top-[60px] md:top-[68px] z-40 border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center mb-1">
          <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="w-5 h-5" /></Link>
        </div>
        <h1 className="max-w-2xl mx-auto text-3xl font-extrabold tracking-tight mb-1">First Aid</h1>
        <p className="max-w-2xl mx-auto text-sm text-gray-400 font-medium mb-4">Offline emergency protocols</p>
        
        <div className="max-w-2xl mx-auto flex items-center bg-gray-100/80 rounded-xl px-4 py-3 border border-gray-200/50 focus-within:border-gray-300 focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="Search symptoms or protocols..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder:text-gray-400" 
          />
        </div>
      </div>

      <div className="p-5 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {filteredProtocols.length > 0 ? filteredProtocols.map((p) => (
            <motion.button
              key={p.id}
              layoutId={`card-${p.id}`}
              onClick={() => setSelectedId(p.id)}
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center gap-3 hover:shadow-md transition-shadow"
            >
              <motion.div layoutId={`icon-${p.id}`} className={`w-14 h-14 ${p.bg} ${p.text} rounded-full flex items-center justify-center`}>
                <p.icon className="w-7 h-7" />
              </motion.div>
              <motion.h3 layoutId={`title-${p.id}`} className="font-extrabold text-base">{p.title}</motion.h3>
            </motion.button>
          )) : (
            <div className="col-span-2 py-10 flex flex-col items-center justify-center text-gray-400">
              <Search className="w-8 h-8 mb-3 opacity-50" />
              <p className="text-sm font-medium">No protocols found for "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-5" onClick={() => setSelectedId(null)}>
            <motion.div layoutId={`card-${selected.id}`} onClick={(e) => e.stopPropagation()} className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-7 pb-4 flex flex-col items-center border-b border-gray-100">
                <motion.div layoutId={`icon-${selected.id}`} className={`w-16 h-16 ${selected.bg} ${selected.text} rounded-full flex items-center justify-center mb-3`}>
                  <selected.icon className="w-8 h-8" />
                </motion.div>
                <motion.h3 layoutId={`title-${selected.id}`} className="font-extrabold text-2xl">{selected.title}</motion.h3>
                <button className="mt-3 flex items-center gap-2 bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">
                  <Volume2 className="w-4 h-4" /> Audio Guide
                </button>
              </div>
              <div className="p-7 overflow-y-auto max-h-[50vh]">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Step-by-step</h4>
                <ul className="flex flex-col gap-3">
                  {selected.steps.map((step, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</div>
                      <p className="text-sm font-medium text-gray-700 pt-1 leading-snug">{step}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div className="p-5 bg-gray-50 border-t border-gray-100">
                <button onClick={() => setSelectedId(null)} className="w-full bg-white border-2 border-gray-200 text-black py-3.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-5 left-5 right-5 max-w-2xl mx-auto z-40">
        <a href="tel:112" className="w-full bg-black text-white py-4 rounded-2xl font-extrabold text-lg shadow-[0_8px_24px_rgba(0,0,0,0.3)] flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
          <Phone className="w-5 h-5 fill-current" />Call 112
        </a>
      </div>
    </div>
  );
}
