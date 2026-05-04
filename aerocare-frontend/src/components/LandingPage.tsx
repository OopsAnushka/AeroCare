'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Ambulance, Radar, Hospital, Droplet, HeartPulse, ArrowRight, Shield, Clock, Users, MapPin } from 'lucide-react';

const FEATURES = [
  { icon: Ambulance, title: 'SOS Dispatch', desc: 'One-tap ambulance request with BLS & ALS units. Average response under 4 minutes.', color: 'bg-red-50 text-red-500', href: '/emergency?tab=dispatch' },
  { icon: Radar, title: 'Samaritan Radar', desc: 'Find CPR-certified volunteers near you in real-time on an interactive map.', color: 'bg-emerald-50 text-emerald-500', href: '/emergency?tab=radar' },
  { icon: Droplet, title: 'Blood Connect', desc: 'Instantly connect with nearby blood donors matching your required type.', color: 'bg-rose-50 text-rose-500', href: '/emergency?tab=blood' },
  { icon: Hospital, title: 'Hospital Finder', desc: 'Live ICU bed availability and one-tap routing to the nearest hospital.', color: 'bg-blue-50 text-blue-500', href: '/emergency?tab=hospitals' },
  { icon: HeartPulse, title: 'CPR Metronome', desc: 'Audio-visual guide beating at 110 BPM to assist chest compressions.', color: 'bg-amber-50 text-amber-500', href: '/emergency?tab=cpr' },
  { icon: Shield, title: 'Medical ID', desc: 'Digital health card with QR code for paramedics to scan on arrival.', color: 'bg-purple-50 text-purple-500', href: '/profile' },
];

const STEPS = [
  { num: '01', title: 'Open AeroCare', desc: 'Launch the app and allow location access for precise dispatch.' },
  { num: '02', title: 'Request Help', desc: 'Tap SOS, select your unit type (BLS/ALS), and confirm pickup location.' },
  { num: '03', title: 'Track & Connect', desc: 'Watch your ambulance approach in real-time. Share status with family.' },
];

const STATS = [
  { value: '12,000+', label: 'Active Responders' },
  { value: '<4 min', label: 'Average Response' },
  { value: '340+', label: 'Partner Hospitals' },
  { value: '98.7%', label: 'Success Rate' },
];

export default function LandingPage() {
  return (
    <div className="w-full bg-white">
      {/* ═══════ HERO ═══════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-black">
        <Image src="/hero-ambulance.png" alt="Emergency response" fill className="object-cover opacity-40" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-20 w-full">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-xs font-bold mb-8 backdrop-blur-md">
                <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                India&apos;s Emergency Response Network
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
              Every Second<br />
              <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Counts.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-lg md:text-xl text-gray-300 font-medium max-w-lg leading-relaxed mb-10">
              Dispatch ambulances, find CPR volunteers, locate hospitals with live ICU beds, and connect with blood donors — all in one tap.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-4">
              <Link href="/emergency" className="bg-white text-black px-8 py-4 rounded-full font-bold text-base hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg">
                Request Emergency
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/10 transition-colors backdrop-blur-sm">
                Join as Responder
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-8 md:gap-12 mt-16">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="text-sm text-gray-400 font-medium">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3">What We Offer</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Life-saving tools at your fingertips</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Link href={f.href} className="block bg-white p-7 rounded-3xl border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all group h-full">
                  <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HERO IMAGE SECTION ═══════ */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="lg:w-1/2">
            <p className="text-sm font-bold text-red-500 uppercase tracking-wider mb-3">Rapid Response</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">Help arrives before<br/>you finish calling</h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 max-w-lg">
              Our AI-powered dispatch pairs you with the nearest available ambulance, routes through real-time traffic data, and alerts the receiving hospital — all within seconds of your SOS.
            </p>
            <div className="flex flex-col gap-4">
              {STEPS.map((s) => (
                <div key={s.num} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">{s.num}</div>
                  <div>
                    <h4 className="font-bold mb-0.5">{s.title}</h4>
                    <p className="text-sm text-gray-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <Image src="/hero-paramedics.png" alt="Paramedics responding" width={700} height={500} className="w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ CTA BANNER ═══════ */}
      <section className="bg-black py-20 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-5">Ready to make a difference?</h2>
          <p className="text-lg text-gray-400 font-medium max-w-xl mx-auto mb-10">
            Whether you need help or want to provide it — AeroCare connects you to the people who matter most.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/emergency" className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full font-bold text-base shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-shadow flex items-center gap-2">
              <Ambulance className="w-5 h-5" /> Launch SOS
            </Link>
            <Link href="/login" className="bg-white text-black px-8 py-4 rounded-full font-bold text-base hover:bg-gray-100 transition-colors">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg flex items-center justify-center font-black text-base">A</div>
            <span className="text-white font-extrabold text-lg tracking-tight">AeroCare</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-400 font-medium">
            <Link href="/first-aid" className="hover:text-white transition-colors">First Aid</Link>
            <Link href="/profile" className="hover:text-white transition-colors">Medical ID</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign Up</Link>
          </div>
          <p className="text-xs text-gray-500">© 2026 AeroCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
