'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Ambulance, Radar, Hospital, Droplet, HeartPulse, ArrowRight, Shield, Zap, MapPin, Phone } from 'lucide-react';

const FEATURES = [
  { icon: Ambulance,  title: 'SOS Dispatch',    desc: 'One-tap ambulance request with BLS & ALS units. Average response under 4 minutes.',    iconCls: 'text-red-500',    bgCls: 'bg-red-50',    linkColor: 'text-red-500',    href: '/emergency?tab=dispatch' },
  { icon: Radar,      title: 'Samaritan Radar', desc: 'Find CPR-certified volunteers near you in real-time on an interactive live map.',         iconCls: 'text-emerald-500',bgCls: 'bg-emerald-50', linkColor: 'text-emerald-500',href: '/emergency?tab=radar' },
  { icon: Droplet,    title: 'Blood Connect',   desc: 'Instantly connect with nearby blood donors matching your required blood type.',           iconCls: 'text-rose-500',   bgCls: 'bg-rose-50',   linkColor: 'text-rose-500',   href: '/emergency?tab=blood' },
  { icon: Hospital,   title: 'Hospital Finder', desc: 'Live ICU bed availability and one-tap routing to the nearest emergency hospital.',        iconCls: 'text-blue-500',   bgCls: 'bg-blue-50',   linkColor: 'text-blue-500',   href: '/emergency?tab=hospitals' },
  { icon: HeartPulse, title: 'CPR Metronome',   desc: 'Audio-visual guide beating at 110 BPM to keep chest compressions on perfect rhythm.',    iconCls: 'text-amber-500',  bgCls: 'bg-amber-50',  linkColor: 'text-amber-500',  href: '/emergency?tab=cpr' },
  { icon: Shield,     title: 'Medical ID',      desc: 'Digital health card with QR code for paramedics to scan instantly on arrival.',          iconCls: 'text-purple-500', bgCls: 'bg-purple-50', linkColor: 'text-purple-500', href: '/profile' },
];

const STEPS = [
  { num: '1', title: 'Open AeroCare', desc: 'Launch the app and grant location access. Everything loads instantly.', color: 'bg-red-500'     },
  { num: '2', title: 'Request Help',  desc: 'Tap SOS, pick BLS or ALS, and confirm your pickup location.',           color: 'bg-blue-500'    },
  { num: '3', title: 'Track Live',    desc: 'Watch your ambulance approach in real-time. Share ETA with family.',    color: 'bg-emerald-500' },
];

const STATS = [
  { value: '12,000+', label: 'Active Responders' },
  { value: '< 4 min', label: 'Avg. Response Time' },
  { value: '340+',    label: 'Partner Hospitals'  },
  { value: '98.7%',   label: 'Success Rate'       },
];

export default function LandingPage() {
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true });

  return (
    <div className="w-full bg-white overflow-x-hidden">

      {/* HERO */}
      <section className="relative bg-[#06090f] min-h-[100dvh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image src="/hero-ambulance.png" alt="Emergency" fill className="object-cover opacity-45" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06090f]/30 via-[#06090f]/60 to-[#06090f]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#06090f]/50 via-transparent to-transparent" />
        </div>
        <div className="pointer-events-none absolute top-[8%] left-[2%] w-[28rem] h-[28rem] bg-red-600/20 rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-[10%] right-[5%] w-[20rem] h-[20rem] bg-blue-600/10 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 py-24 w-full">
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}>
            <span className="inline-flex items-center gap-2 bg-red-500/15 border border-red-500/30 text-red-400 px-5 py-2 rounded-full text-xs font-bold mb-8 backdrop-blur-sm">
              <motion.span animate={{ opacity:[1,0.2,1] }} transition={{ duration:1.4, repeat:Infinity }}
                className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,1)]" />
              India&apos;s Live Emergency Response Network
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="text-[2.75rem] sm:text-[3.5rem] md:text-[5rem] font-black text-white tracking-tight leading-[1.04] mb-6">
            Every Second<br />
            <span className="bg-gradient-to-r from-red-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
              Counts.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="text-base sm:text-lg text-gray-300 font-medium max-w-lg leading-relaxed mb-10">
            Dispatch ambulances, find CPR volunteers, locate hospitals with live ICU beds, and connect with blood donors - all in one tap.
          </motion.p>

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link href="/emergency"
              className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-extrabold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.45)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.6)] transition-all duration-200">
              <Ambulance className="w-5 h-5" />
              Request Emergency
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-black font-extrabold text-base sm:text-lg px-8 py-4 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-lg">
              Join as Responder
            </Link>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center backdrop-blur-md">
                <p className="text-xl sm:text-2xl font-black text-white">{s.value}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 md:py-28 bg-gray-50" ref={featuresRef}>
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12">
          <div className="text-center mb-14">
            <span className="inline-block bg-red-50 text-red-500 text-[11px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-4">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900">Life-saving tools at<br className="hidden sm:block" /> your fingertips</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity:0, y:30 }} animate={featuresInView ? { opacity:1, y:0 } : {}}
                  transition={{ duration:0.4, delay:i*0.07 }}>
                  <Link href={f.href}
                    className="flex flex-col h-full bg-white border border-gray-100 rounded-[1.5rem] p-6 sm:p-7 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
                    <div className={`w-[52px] h-[52px] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shrink-0 ${f.bgCls}`}>
                      <Icon className={`w-6 h-6 ${f.iconCls}`} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium flex-1">{f.desc}</p>
                    <div className={`mt-4 flex items-center gap-1 text-sm font-bold ${f.linkColor}`}>
                      Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-28 bg-white relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 w-[30rem] h-[30rem] bg-red-50 rounded-full blur-[80px]" />
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

            <div className="lg:w-1/2 w-full">
              <span className="inline-block bg-red-50 text-red-500 text-[11px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full mb-6">How It Works</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight mb-6">
                Help arrives before<br />you finish calling
              </h2>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
                Our AI-powered dispatch pairs you with the nearest available ambulance, routes through real-time traffic, and alerts the receiving hospital within seconds.
              </p>
              <div className="space-y-6">
                {STEPS.map((s, i) => (
                  <motion.div key={s.num} initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }}
                    viewport={{ once:true }} transition={{ delay:i*0.12, duration:0.4 }}
                    className="flex items-start gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shrink-0 shadow-lg ${s.color}`}>
                      {s.num}
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-gray-900 mb-1">{s.title}</h4>
                      <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Link href="/emergency"
                  className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold px-7 py-4 rounded-2xl transition-colors shadow-lg shadow-red-500/25">
                  <Ambulance className="w-5 h-5" /> Launch SOS Now
                </Link>
                <a href="tel:112"
                  className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 font-bold px-7 py-4 rounded-2xl hover:border-red-200 hover:text-red-500 transition-colors">
                  <Phone className="w-5 h-5" /> Call 112
                </a>
              </div>
            </div>

            <div className="lg:w-1/2 w-full relative">
              <div className="rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)]">
                <Image src="/hero-paramedics.png" alt="Paramedics" width={700} height={500} className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 md:py-28 bg-[#06090f] relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-950/40 via-transparent to-blue-950/20" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] bg-red-600/10 rounded-full blur-[100px]" />
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 text-center relative z-10">
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}>
            <span className="inline-block bg-red-500/15 border border-red-500/25 text-red-400 text-[11px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full mb-8">
              Join The Network
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
              Ready to save a life?
            </h2>
            <p className="text-base sm:text-lg text-gray-400 font-medium max-w-xl mx-auto mb-10">
              Whether you need help or want to provide it - AeroCare connects you to the people who matter most, instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/emergency"
                className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-extrabold text-base sm:text-lg px-10 py-4 rounded-2xl shadow-[0_8px_32px_rgba(239,68,68,0.5)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.65)] active:scale-95 transition-all duration-200">
                <Ambulance className="w-5 h-5" /> Launch SOS
              </Link>
              <Link href="/login"
                className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 font-extrabold text-base sm:text-lg px-10 py-4 rounded-2xl hover:bg-gray-100 active:scale-95 transition-all duration-200 shadow-lg">
                Create Free Account
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-50 border-t border-gray-100 py-10">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-lg flex items-center justify-center font-black text-base shadow-md">A</div>
            <span className="text-gray-900 font-extrabold text-lg tracking-tight">AeroCare</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400 font-semibold">
            <Link href="/first-aid" className="hover:text-gray-900 transition-colors">First Aid</Link>
            <Link href="/profile"   className="hover:text-gray-900 transition-colors">Medical ID</Link>
            <Link href="/login"     className="hover:text-gray-900 transition-colors">Sign Up</Link>
            <Link href="/hospital"  className="hover:text-gray-900 transition-colors">Hospital Portal</Link>
            <Link href="/emergency" className="hover:text-gray-900 transition-colors">Emergency</Link>
          </div>
          <p className="text-xs text-gray-400">2026 AeroCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}