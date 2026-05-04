'use client';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, BedDouble, Wind, Users, Ambulance,
  LogOut, Bell, Clock, Activity, Stethoscope,
  LayoutDashboard, MapPin, ChevronDown,
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { HospitalProfile, AmbulanceUnit, StaffMember } from '@/lib/firestore';
import BedsTab from './tabs/BedsTab';
import VentilatorsTab from './tabs/VentilatorsTab';
import OTTab from './tabs/OTTab';
import StaffTab from './tabs/StaffTab';
import AmbulanceTab from './tabs/AmbulanceTab';

type Tab = 'overview' | 'beds' | 'ventilators' | 'ot' | 'staff' | 'ambulance';

const NAV = [
  { id: 'overview',    icon: LayoutDashboard, label: 'Overview' },
  { id: 'beds',        icon: BedDouble,       label: 'ICU Beds' },
  { id: 'ventilators', icon: Wind,            label: 'Ventilators' },
  { id: 'ot',          icon: Stethoscope,     label: 'OT Rooms' },
  { id: 'staff',       icon: Users,           label: 'Staff' },
  { id: 'ambulance',   icon: Ambulance,       label: 'Ambulance' },
] as const;

export default function HospitalDashboard() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [hData, setHData] = useState<HospitalProfile | null>(null);
  const [firestoreError, setFirestoreError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  /* Live clock */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* Auth guard — only runs after auth state is resolved */
  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/hospital'); return; }
    if (profile && profile.role !== 'hospital') { router.replace('/'); }
  }, [user, profile, loading, router]);

  /* Firestore real-time listener — primary data source for dashboard */
  useEffect(() => {
    if (!user || !db) return;
    setFirestoreError(false);
    const ref = doc(db, 'users', user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          setHData(snap.data() as HospitalProfile);
        } else {
          // Document doesn't exist yet — can happen right after registration
          setFirestoreError(true);
        }
      },
      (err) => {
        console.error('Firestore onSnapshot error:', err);
        setFirestoreError(true);
      }
    );
    // 8-second timeout: if still no data, show error
    const timeout = setTimeout(() => {
      setHData(prev => {
        if (!prev) setFirestoreError(true);
        return prev;
      });
    }, 8000);
    return () => { unsub(); clearTimeout(timeout); };
  }, [user]);

  const updateField = useCallback(async (fields: Partial<HospitalProfile>) => {
    if (!user || !db) return;
    await updateDoc(doc(db, 'users', user.uid), { ...fields, updatedAt: serverTimestamp() });
  }, [user]);

  /* ── While auth is resolving ── */
  if (loading) {
    return (
      <div className="h-screen bg-[#06090f] flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full" />
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">Authenticating…</p>
      </div>
    );
  }

  /* ── Not logged in (redirect in progress) ── */
  if (!user) {
    return (
      <div className="h-screen bg-[#06090f] flex items-center justify-center">
        <p className="text-gray-600 text-sm">Redirecting to login…</p>
      </div>
    );
  }

  /* ── Waiting for Firestore data ── */
  if (!hData && !firestoreError) {
    return (
      <div className="h-screen bg-[#06090f] flex flex-col items-center justify-center gap-4">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full" />
        <p className="text-gray-600 text-xs font-bold uppercase tracking-widest">Loading Dashboard…</p>
      </div>
    );
  }

  /* ── Firestore error / empty profile ── */
  if (firestoreError && !hData) {
    return (
      <div className="h-screen bg-[#06090f] flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
          <Activity className="w-7 h-7 text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-white font-extrabold text-lg mb-2">Connection Error</h2>
          <p className="text-gray-500 text-sm max-w-sm">Could not reach the database. Check your internet connection and Firebase configuration.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setFirestoreError(false); setHData(null); }}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-sm transition-all">
            Retry
          </button>
          <button onClick={() => { signOut(); router.push('/hospital'); }}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-xl text-sm transition-all">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // hp is guaranteed non-null here (either hData or profile fallback)
  const hp = (hData ?? profile) as HospitalProfile;


  const kpis = [
    { icon: BedDouble,   label: 'Available Beds', value: hp.availableBeds ?? '–',        sub: `of ${hp.totalBeds ?? '–'} total`,       color: 'emerald' },
    { icon: Activity,    label: 'ICU Units Free',  value: hp.availableIcuBeds ?? '–',     sub: `of ${hp.icuBeds ?? '–'} ICU`,           color: 'rose'    },
    { icon: Wind,        label: 'Ventilators',     value: hp.availableVentilators ?? '–', sub: `of ${hp.ventilators ?? '–'} total`,     color: 'blue'    },
    { icon: Stethoscope, label: 'OTs Available',   value: hp.availableOTs ?? '–',         sub: `of ${hp.operationTheatres ?? '–'} OTs`, color: 'amber'   },
  ];

  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-500/20 border-emerald-500/20 text-emerald-400 shadow-emerald-500/10',
    rose:    'from-rose-500/20 border-rose-500/20 text-rose-400 shadow-rose-500/10',
    blue:    'from-blue-500/20 border-blue-500/20 text-blue-400 shadow-blue-500/10',
    amber:   'from-amber-500/20 border-amber-500/20 text-amber-400 shadow-amber-500/10',
  };

  return (
    <div className="flex h-screen bg-[#06090f] text-gray-200 overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16 lg:w-60'} bg-[#0a0f18] border-r border-white/5 flex flex-col transition-all duration-300 z-30 shrink-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-white/5 shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.3)] shrink-0">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <span className="hidden lg:block font-extrabold text-white tracking-tight truncate">AeroCare</span>
        </div>

        {/* Hospital name */}
        <div className="hidden lg:block px-4 py-3 border-b border-white/5">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Facility</p>
          <p className="text-sm font-bold text-white truncate mt-0.5">{hp.hospitalName}</p>
          <p className="text-[11px] text-gray-600 truncate">{hp.city}, {hp.state}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id as Tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group ${
                tab === id ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'
              }`}>
              {tab === id && <motion.div layoutId="sidebarActive" className="absolute left-0 top-2 bottom-2 w-0.5 bg-emerald-500 rounded-r-full" />}
              <Icon className="w-4 h-4 shrink-0 z-10" />
              <span className="hidden lg:block text-sm font-semibold z-10">{label}</span>
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-white/5">
          <button onClick={() => { signOut(); router.push('/hospital'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden lg:block text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="h-16 bg-[#0a0f18]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 shrink-0">
          <div>
            <h1 className="font-extrabold text-white text-base">{hp.hospitalName || 'Command Center'}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Network Active</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-bold text-gray-300 font-mono">{time.toLocaleTimeString('en-IN', { hour12: false })}</span>
            </div>
            <button className="relative p-2 text-gray-500 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center font-bold text-white text-xs">
              {hp.hospitalName?.charAt(0) ?? 'H'}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

              {tab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {kpis.map((k) => {
                      const cls = colorMap[k.color];
                      return (
                        <div key={k.label} className={`bg-gradient-to-br ${cls.split(' ')[0]} to-transparent bg-[#0d131a] border ${cls.split(' ')[1]} rounded-2xl p-5 shadow-lg ${cls.split(' ')[3]}`}>
                          <div className="flex justify-between items-start mb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{k.label}</p>
                            <k.icon className={`w-4 h-4 ${cls.split(' ')[2]}`} />
                          </div>
                          <p className="text-3xl font-black text-white">{k.value}</p>
                          <p className="text-[11px] text-gray-600 mt-1">{k.sub}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick-edit grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuickEdit title="Beds" icon={BedDouble} color="emerald"
                      rows={[
                        { label: 'Total Beds',     field: 'totalBeds',     value: hp.totalBeds ?? '0' },
                        { label: 'Available Beds', field: 'availableBeds', value: hp.availableBeds ?? '0' },
                        { label: 'Total ICU',      field: 'icuBeds',       value: hp.icuBeds ?? '0' },
                        { label: 'Available ICU',  field: 'availableIcuBeds', value: hp.availableIcuBeds ?? '0' },
                      ]} onSave={updateField} />

                    <QuickEdit title="Ventilators & OT" icon={Wind} color="blue"
                      rows={[
                        { label: 'Total Ventilators',     field: 'ventilators',          value: hp.ventilators ?? '0' },
                        { label: 'Available Ventilators', field: 'availableVentilators', value: hp.availableVentilators ?? '0' },
                        { label: 'Total OT Rooms',        field: 'operationTheatres',    value: hp.operationTheatres ?? '0' },
                        { label: 'Available OTs',         field: 'availableOTs',         value: hp.availableOTs ?? '0' },
                      ]} onSave={updateField} />
                  </div>

                  {/* Fleet summary */}
                  <div className="bg-[#0d131a] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Ambulance className="w-4 h-4 text-blue-400" />
                        <h3 className="font-bold text-white text-sm">Ambulance Fleet</h3>
                      </div>
                      <button onClick={() => setTab('ambulance')} className="text-xs text-emerald-400 font-bold hover:text-emerald-300 transition-colors">Manage →</button>
                    </div>
                    {(!hp.ambulances || hp.ambulances.length === 0) ? (
                      <p className="text-gray-600 text-sm text-center py-6">No ambulances registered. <button onClick={() => setTab('ambulance')} className="text-emerald-400 font-bold">Add one →</button></p>
                    ) : (
                      <div className="space-y-2">
                        {hp.ambulances.slice(0, 4).map((a) => (
                          <AmbulanceRow key={a.id} unit={a} />
                        ))}
                        {hp.ambulances.length > 4 && (
                          <p className="text-center text-xs text-gray-600 pt-1">+{hp.ambulances.length - 4} more</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {tab === 'beds'        && <BedsTab        hp={hp} onSave={updateField} />}
              {tab === 'ventilators' && <VentilatorsTab hp={hp} onSave={updateField} />}
              {tab === 'ot'          && <OTTab          hp={hp} onSave={updateField} />}
              {tab === 'staff'       && <StaffTab       hp={hp} onSave={updateField} userId={user.uid} />}
              {tab === 'ambulance'   && <AmbulanceTab   hp={hp} onSave={updateField} userId={user.uid} />}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ── QuickEdit card (overview tab) ── */
function QuickEdit({ title, icon: Icon, color, rows, onSave }: {
  title: string; icon: any; color: string;
  rows: { label: string; field: string; value: string }[];
  onSave: (f: any) => Promise<void>;
}) {
  const [vals, setVals] = useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map(r => [r.field, r.value]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setVals(Object.fromEntries(rows.map(r => [r.field, r.value])));
  }, [rows.map(r => r.value).join(',')]);

  const borderColor = color === 'emerald' ? 'border-emerald-500/30' : 'border-blue-500/30';
  const textColor = color === 'emerald' ? 'text-emerald-400' : 'text-blue-400';
  const glowColor = color === 'emerald' ? 'focus:border-emerald-500/60' : 'focus:border-blue-500/60';

  const save = async () => {
    setSaving(true);
    await onSave(vals);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-[#0d131a] border border-white/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={`w-4 h-4 ${textColor}`} />
        <h3 className="font-bold text-white text-sm">{title}</h3>
      </div>
      <div className="space-y-3">
        {rows.map(r => (
          <div key={r.field} className="flex items-center justify-between">
            <label className="text-xs text-gray-500">{r.label}</label>
            <input type="number" min="0" value={vals[r.field] ?? '0'}
              onChange={e => setVals(v => ({ ...v, [r.field]: e.target.value }))}
              className={`w-20 bg-white/5 border ${borderColor} ${glowColor} rounded-lg px-2 py-1.5 text-center text-sm font-bold text-white focus:outline-none transition-colors`} />
          </div>
        ))}
      </div>
      <button onClick={save} disabled={saving}
        className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all ${
          saved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : `bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5`
        }`}>
        {saving ? 'Saving…' : saved ? '✓ Synced' : 'Save & Sync'}
      </button>
    </div>
  );
}

/* ── Ambulance row in overview ── */
function AmbulanceRow({ unit }: { unit: AmbulanceUnit }) {
  const statusColor: Record<string, string> = {
    available:   'bg-emerald-500',
    dispatched:  'bg-blue-500',
    maintenance: 'bg-amber-500',
    offline:     'bg-gray-600',
  };
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] rounded-xl">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${statusColor[unit.status] ?? 'bg-gray-600'}`} />
        <span className="text-sm font-bold text-white">{unit.vehiclePlate}</span>
        <span className="text-xs text-gray-500">{unit.unitType}</span>
      </div>
      <div className="flex items-center gap-2">
        {unit.lat && <MapPin className="w-3 h-3 text-gray-600" />}
        <span className="text-xs text-gray-500 capitalize">{unit.status}</span>
      </div>
    </div>
  );
}
