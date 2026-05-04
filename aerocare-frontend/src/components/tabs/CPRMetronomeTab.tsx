'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const BPM = 110;
const INTERVAL_MS = 60_000 / BPM;

export default function CPRMetronomeTab() {
  const [active, setActive] = useState(false);
  const [count, setCount] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }

    audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    const id = setInterval(() => {
      setCount((c) => c + 1);
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    }, INTERVAL_MS);

    return () => {
      clearInterval(id);
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, [active]);

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-4">
      <div className="text-center">
        <h2 className="text-[1.65rem] font-extrabold tracking-tight">CPR Metronome</h2>
        <p className="text-sm text-gray-400 font-medium mt-1">Compress to the beat — {BPM} BPM</p>
      </div>

      {/* Pulse Circle */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        {active && (
          <>
            <motion.div
              animate={{ scale: [0.8, 1.6], opacity: [0.5, 0] }}
              transition={{ duration: INTERVAL_MS / 1000, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 bg-red-500 rounded-full"
            />
            <motion.div
              animate={{ scale: [0.8, 1.6], opacity: [0.3, 0] }}
              transition={{ duration: INTERVAL_MS / 1000, repeat: Infinity, ease: 'easeOut', delay: 0.15 }}
              className="absolute inset-0 bg-red-400 rounded-full"
            />
          </>
        )}
        <div
          className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
            active
              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white shadow-[0_0_40px_rgba(239,68,68,0.5)]'
              : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
          }`}
        >
          <span className="font-extrabold text-3xl leading-none">{active ? count : BPM}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{active ? 'Beats' : 'BPM'}</span>
        </div>
      </div>

      <button
        onClick={() => setActive((a) => !a)}
        className={`w-full py-4 rounded-2xl font-bold text-base transition-all shadow-lg flex items-center justify-center ${
          active
            ? 'bg-black text-white hover:bg-gray-900'
            : 'bg-gradient-to-r from-red-500 to-red-600 text-white glow-pulse'
        }`}
      >
        {active ? 'STOP' : 'START COMPRESSIONS'}
      </button>
    </div>
  );
}
