'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, ArrowRight, ArrowLeft, Eye, EyeOff,
  Mail, Lock, Phone, MapPin, IdCard, ShieldCheck,
  AlertCircle, CheckCircle2, Activity, Ambulance, BedDouble, Stethoscope, Heart,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { createUserProfile } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh',
];

const CITY_MAP: Record<string,string[]> = {
  'Madhya Pradesh': ['Indore','Bhopal','Gwalior','Ujjain','Jabalpur'],
  'Maharashtra': ['Mumbai','Pune','Nagpur','Nashik','Aurangabad'],
  'Delhi': ['New Delhi','Dwarka','Rohini','Lajpat Nagar'],
  'Gujarat': ['Ahmedabad','Surat','Vadodara','Rajkot'],
  'Rajasthan': ['Jaipur','Jodhpur','Udaipur','Kota'],
  'Karnataka': ['Bengaluru','Mysuru','Hubli','Mangaluru'],
  'Tamil Nadu': ['Chennai','Coimbatore','Madurai','Salem'],
  'Uttar Pradesh': ['Lucknow','Kanpur','Varanasi','Agra','Noida'],
  'West Bengal': ['Kolkata','Howrah','Durgapur','Siliguri'],
  'Telangana': ['Hyderabad','Warangal','Karimnagar'],
  'Kerala': ['Thiruvananthapuram','Kochi','Kozhikode','Thrissur'],
};

const FEATURES = [
  { icon: BedDouble,   label: 'Bed Management',  desc: 'Manage ICU, general & emergency beds in real-time.' },
  { icon: Ambulance,   label: 'Fleet Radar',      desc: 'Track every ambulance live with GPS telemetry.' },
  { icon: Activity,    label: 'Resource Sync',    desc: 'Push ventilator & OT availability instantly.' },
  { icon: Stethoscope, label: 'Staff Directory',  desc: 'Manage shifts for doctors, nurses and paramedics.' },
];

export default function HospitalAuthPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);

  const [mode, setMode] = useState<'login'|'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (user && profile?.role === 'hospital') router.replace('/hospital/dashboard');
  }, [user, profile, authLoading, router]);

  useEffect(() => { setCities(selectedState ? (CITY_MAP[selectedState] ?? []) : []); }, [selectedState]);

  const friendlyError = (code: string) => ({
    'auth/email-already-in-use': 'This email is already registered. Try signing in.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment.',
  } as Record<string,string>)[code] || `Error: ${code}`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(''); setLoading(true);
    const form = formRef.current!;
    const email    = (form.elements.namedItem('email')    as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;
    try {
      if (!auth) { setError('Firebase is not configured.'); setLoading(false); return; }
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Welcome back! Redirecting...');
        await refreshProfile();
        router.push('/hospital/dashboard');
      } else {
        const hospitalName  = (form.elements.namedItem('hospitalName')  as HTMLInputElement).value;
        const regNo         = (form.elements.namedItem('regNo')         as HTMLInputElement).value;
        const phone         = (form.elements.namedItem('phone')         as HTMLInputElement).value;
        const address       = (form.elements.namedItem('address')       as HTMLInputElement).value;
        const state         = (form.elements.namedItem('state')         as HTMLSelectElement).value;
        const city          = (form.elements.namedItem('city')          as HTMLSelectElement).value;
        const contactPerson = (form.elements.namedItem('contactPerson') as HTMLInputElement).value;
        const contactRole   = (form.elements.namedItem('contactRole')   as HTMLInputElement).value;
        if (!hospitalName || !state || !city) { setError('Please fill all required fields.'); setLoading(false); return; }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(cred.user.uid, {
          role:'hospital', hospitalName, registrationNumber:regNo, phone, address, state, city,
          email, contactPerson, contactRole, totalBeds:'0', availableBeds:'0', icuBeds:'0',
          availableIcuBeds:'0', ventilators:'0', availableVentilators:'0',
          operationTheatres:'0', availableOTs:'0', ambulances:[], staff:[],
        } as any);
        setSuccess('Facility registered! Setting up your dashboard...');
        await refreshProfile();
        router.push('/hospital/dashboard');
      }
    } catch (err: any) {
      setError(err.code ? friendlyError(err.code) : err.message || 'An unknown error occurred.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const emailEl = formRef.current?.elements.namedItem('email') as HTMLInputElement;
    if (!emailEl?.value) { setError('Enter your email above first.'); return; }
    if (!auth) return;
    try { await sendPasswordResetEmail(auth, emailEl.value); setResetSent(true); setTimeout(() => setResetSent(false), 5000); }
    catch (err: any) { setError(friendlyError(err.code)); }
  };

  return (
    <div className="min-h-screen flex bg-[#06090f] text-white font-sans overflow-hidden">

      {/* ══ LEFT HERO PANEL ══ */}
      <div className="hidden lg:flex w-[45%] flex-col relative overflow-hidden">
        {/* Hospital background image */}
        <div className="absolute inset-0 z-0">
          <Image src="/hospital_hero.png" alt="Hospital interior" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06090f] via-[#06090f]/75 to-[#06090f]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#06090f]/30" />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 to-teal-950/40" />
        </div>

        {/* Glow orbs */}
        <div className="absolute top-[-5%] left-[-5%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[100px] z-0" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[100px] z-0" />

        {/* Back link */}
        <Link href="/" className="relative z-10 flex items-center gap-2 text-emerald-400/70 hover:text-emerald-300 transition-colors font-bold text-sm m-8 w-fit backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10">
          <ArrowLeft className="w-4 h-4" /> Back to AeroCare
        </Link>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center flex-1 px-12 pb-16">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold mb-8 w-fit backdrop-blur-md">
            <motion.div animate={{ scale:[1,1.5,1] }} transition={{ duration:1.5, repeat:Infinity }}
              className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            Hospital Command Network
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="text-5xl font-extrabold tracking-tight leading-[1.1] mb-4">
            AeroCare<br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Hospital Portal</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
            className="text-gray-300 text-base font-medium leading-relaxed mb-10 max-w-sm">
            Connect your facility to the live AeroCare emergency network — update resources, track fleet, and respond faster.
          </motion.p>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }} className="space-y-4">
            {FEATURES.map((f, i) => (
              <motion.div key={f.label} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                transition={{ delay:0.5+i*0.1 }} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0 backdrop-blur-sm">
                  <f.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{f.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.9 }}
            className="flex gap-8 mt-10 pt-8 border-t border-white/10">
            {[{v:'340+',l:'Hospitals'},{v:'< 90s',l:'Sync Time'},{v:'24/7',l:'Uptime'}].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-black text-white">{s.v}</p>
                <p className="text-xs text-gray-400 font-medium">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ══ RIGHT FORM PANEL ══ */}
      <div className="flex-1 flex items-start lg:items-center justify-center p-5 sm:p-8 lg:p-10 bg-[#0a0f18] overflow-y-auto">
        <motion.div initial={{ opacity:0, scale:0.97 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.4 }}
          className="w-full max-w-[460px] my-6 lg:my-0">

          {/* Mobile back */}
          <Link href="/" className="lg:hidden flex items-center gap-2 text-emerald-400/70 hover:text-emerald-300 transition-colors font-bold text-sm mb-6 w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to AeroCare
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-[0_0_24px_rgba(16,185,129,0.4)]">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-extrabold text-white text-lg tracking-tight leading-none">AeroCare</p>
              <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest">Hospital Portal</p>
            </div>
          </div>

          {/* Mode switcher */}
          <div className="flex bg-white/5 rounded-2xl p-1.5 mb-8 border border-white/5 relative">
            <motion.div className="absolute top-1.5 bottom-1.5 bg-emerald-500 rounded-xl shadow-[0_0_16px_rgba(16,185,129,0.4)]"
              animate={{ left: mode==='login' ? '6px' : '50%', width:'calc(50% - 6px)' }}
              transition={{ type:'spring', bounce:0.2, duration:0.5 }} />
            <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl relative z-10 transition-colors ${mode==='login' ? 'text-white' : 'text-gray-500'}`}>
              Sign In
            </button>
            <button type="button" onClick={() => { setMode('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl relative z-10 transition-colors ${mode==='register' ? 'text-white' : 'text-gray-500'}`}>
              Register Facility
            </button>
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}>
              <h2 className="text-2xl font-extrabold text-white mb-1">{mode==='login' ? 'Welcome back' : 'Register your facility'}</h2>
              <p className="text-sm text-gray-500 mb-6">{mode==='login' ? 'Access your hospital command dashboard.' : 'Join the AeroCare emergency response network.'}</p>
            </motion.div>
          </AnimatePresence>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-4 py-3 rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />{error}
              </motion.div>
            )}
            {success && (
              <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold px-4 py-3 rounded-xl mb-4">
                <CheckCircle2 className="w-4 h-4 shrink-0" />{success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
            <AnimatePresence mode="wait">
              <motion.div key={mode} initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-12 }} transition={{ duration:0.2 }}>
                {mode==='register' && (
                  <div className="space-y-3 mb-3">
                    <HField id="hospitalName" label="Hospital / Facility Name" icon={Building2} placeholder="e.g. Bombay Hospital & Medical Research" required />
                    <div className="grid grid-cols-2 gap-3">
                      <HField id="regNo" label="Reg. Number" icon={IdCard} placeholder="MH/2024/XXXX" />
                      <HField id="phone" label="Contact No." icon={Phone} type="tel" placeholder="+91 98765 43210" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <HSelect id="state" label="State" icon={MapPin} value={selectedState} onChange={(v)=>setSelectedState(v)} options={INDIAN_STATES} placeholder="Select State" required />
                      <HSelect id="city" label="City" icon={MapPin} value="" onChange={()=>{}} options={cities} placeholder={selectedState ? 'Select City' : 'State first'} required />
                    </div>
                    <HField id="address" label="Full Address" icon={MapPin} placeholder="Street, Area, PIN Code" />
                    <div className="grid grid-cols-2 gap-3">
                      <HField id="contactPerson" label="Contact Person" icon={ShieldCheck} placeholder="Full Name" />
                      <HField id="contactRole" label="Designation" icon={ShieldCheck} placeholder="e.g. Medical Director" />
                    </div>
                    <div className="h-px bg-white/5 my-1" />
                  </div>
                )}

                <HField id="email" label="Official Email" icon={Mail} type="email" placeholder="admin@hospital.com" required />

                <div className="mt-3">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Password</label>
                  <div className="relative flex items-center rounded-xl border border-white/10 bg-white/5 transition-all focus-within:border-emerald-500/50 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]">
                    <Lock className="absolute left-3.5 w-4 h-4 text-gray-600" />
                    <input name="password" type={showPw ? 'text' : 'password'} required
                      placeholder={mode==='register' ? 'Create a strong password (6+ chars)' : 'Enter your password'}
                      className="w-full bg-transparent px-4 py-3 pl-10 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 text-gray-600 hover:text-gray-400 transition-colors">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {mode==='login' && (
              <div className="text-right">
                <button type="button" onClick={handleForgotPassword} className="text-xs text-emerald-400/70 hover:text-emerald-400 font-bold transition-colors">
                  {resetSent ? '✓ Reset email sent!' : 'Forgot password?'}
                </button>
              </div>
            )}

            <motion.button whileHover={{ scale:1.015 }} whileTap={{ scale:0.985 }} type="submit"
              disabled={loading || !!success}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-[0_4px_24px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2">
              {loading ? (
                <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>{mode==='login' ? 'Access Dashboard' : 'Register Facility'}<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6">
            {mode==='login' ? "Don't have an account? " : 'Already registered? '}
            <button onClick={() => { setMode(mode==='login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">
              {mode==='login' ? 'Register your facility' : 'Sign in here'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function HField({ id, label, icon: Icon, type='text', placeholder, required=false }: {
  id:string; label:string; icon:any; type?:string; placeholder:string; required?:boolean;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">{label}</label>
      <div className="relative flex items-center rounded-xl border border-white/10 bg-white/5 transition-all focus-within:border-emerald-500/50 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]">
        <Icon className="absolute left-3.5 w-4 h-4 text-gray-600" />
        <input name={id} id={id} type={type} required={required} placeholder={placeholder}
          className="w-full bg-transparent px-4 py-3 pl-10 text-sm text-white placeholder:text-gray-600 focus:outline-none" />
      </div>
    </div>
  );
}

function HSelect({ id, label, icon: Icon, options, placeholder, required=false, value, onChange }: {
  id:string; label:string; icon:any; options:string[]; placeholder:string; required?:boolean; value:string; onChange:(v:string)=>void;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">{label}</label>
      <div className="relative flex items-center rounded-xl border border-white/10 bg-white/5 transition-all focus-within:border-emerald-500/50 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.1)]">
        <Icon className="absolute left-3.5 w-4 h-4 text-gray-600 pointer-events-none z-10" />
        <select name={id} id={id} required={required} defaultValue="" onChange={(e)=>onChange(e.target.value)}
          className="w-full bg-transparent px-4 py-3 pl-10 text-sm text-white focus:outline-none appearance-none cursor-pointer [&>option]:bg-[#0a0f18] [&>option]:text-white">
          <option value="" disabled>{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );
}