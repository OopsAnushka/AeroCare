'use client';
import { useState, useEffect, useRef } from 'react';
import { Ambulance, Plus, Trash2, MapPin, Navigation, RefreshCw } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { HospitalProfile, AmbulanceUnit } from '@/lib/firestore';
import dynamic from 'next/dynamic';

// Lazy-load Leaflet map to avoid SSR issues
const AmbulanceMap = dynamic(() => import('./AmbulanceMap'), { ssr: false, loading: () => (
  <div className="h-full flex items-center justify-center bg-[#060a0f]">
    <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
  </div>
) });

const UNIT_TYPES: AmbulanceUnit['unitType'][] = ['ALS', 'BLS', 'Patient Transport'];
const STATUSES: AmbulanceUnit['status'][] = ['available', 'dispatched', 'maintenance', 'offline'];

const statusConfig: Record<AmbulanceUnit['status'], { color: string; dot: string }> = {
  available:   { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-500' },
  dispatched:  { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',          dot: 'bg-blue-500'   },
  maintenance: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',       dot: 'bg-amber-500'  },
  offline:     { color: 'bg-gray-500/10 text-gray-500 border-gray-500/20',          dot: 'bg-gray-600'   },
};

type BlankUnit = { vehiclePlate: string; driverName: string; driverPhone: string; unitType: AmbulanceUnit['unitType'] };

export default function AmbulanceTab({ hp, userId }: {
  hp: HospitalProfile; onSave: (f: any) => Promise<void>; userId: string;
}) {
  const ambulances = hp.ambulances ?? [];
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState<AmbulanceUnit | null>(null);
  const [form, setForm] = useState<BlankUnit>({ vehiclePlate: '', driverName: '', driverPhone: '', unitType: 'BLS' });

  const saveAmbulances = async (updated: AmbulanceUnit[]) => {
    if (!db) return;
    await updateDoc(doc(db, 'users', userId), { ambulances: updated, updatedAt: serverTimestamp() });
  };

  const addUnit = async () => {
    if (!form.vehiclePlate || !form.driverName) return;
    setSaving(true);
    const unit: AmbulanceUnit = {
      id: crypto.randomUUID(),
      vehiclePlate: form.vehiclePlate.toUpperCase(),
      driverName: form.driverName,
      driverPhone: form.driverPhone,
      unitType: form.unitType,
      status: 'available',
    };
    await saveAmbulances([...ambulances, unit]);
    setForm({ vehiclePlate: '', driverName: '', driverPhone: '', unitType: 'BLS' });
    setSaving(false); setAdding(false);
  };

  const removeUnit = async (unit: AmbulanceUnit) => {
    await saveAmbulances(ambulances.filter(a => a.id !== unit.id));
    if (selected?.id === unit.id) setSelected(null);
  };

  const updateStatus = async (unit: AmbulanceUnit, status: AmbulanceUnit['status']) => {
    const updated = ambulances.map(a => a.id === unit.id ? { ...a, status } : a);
    await saveAmbulances(updated);
  };

  // Simulate GPS update for demo purposes
  const simulateLocation = async (unit: AmbulanceUnit) => {
    const baseLat = 22.7196 + (Math.random() - 0.5) * 0.05;
    const baseLng = 75.8577 + (Math.random() - 0.5) * 0.05;
    const updated = ambulances.map(a => a.id === unit.id
      ? { ...a, lat: baseLat, lng: baseLng, lastLocationUpdate: new Date().toISOString() }
      : a
    );
    await saveAmbulances(updated);
  };

  const active  = ambulances.filter(a => a.status === 'available').length;
  const enRoute = ambulances.filter(a => a.status === 'dispatched').length;
  const located = ambulances.filter(a => a.lat !== undefined).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-blue-400" /> Ambulance Fleet
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {active} available · {enRoute} en route · {located} with GPS signal
          </p>
        </div>
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm font-bold transition-all">
          <Plus className="w-4 h-4" /> Add Unit
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { l: 'Total Fleet',  v: ambulances.length, c: 'text-white'        },
          { l: 'Available',    v: active,             c: 'text-emerald-400'  },
          { l: 'Dispatched',   v: enRoute,            c: 'text-blue-400'     },
          { l: 'GPS Online',   v: located,            c: 'text-teal-400'     },
        ].map(s => (
          <div key={s.l} className="bg-[#0d131a] border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{s.l}</p>
            <p className={`text-3xl font-black ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Live Map + Fleet list — two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Map */}
        <div className="xl:col-span-3 bg-[#0d131a] border border-white/5 rounded-2xl overflow-hidden" style={{ height: 420 }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-bold text-white">Live Fleet Tracker</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>
          <div className="h-[calc(100%-48px)]">
            <AmbulanceMap ambulances={ambulances} selected={selected} onSelect={setSelected} />
          </div>
        </div>

        {/* Fleet list */}
        <div className="xl:col-span-2 bg-[#0d131a] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
            <Ambulance className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-bold text-white">Fleet Units</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {ambulances.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-600">
                <Ambulance className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">No units registered</p>
              </div>
            ) : ambulances.map(unit => {
              const cfg = statusConfig[unit.status];
              const isSelected = selected?.id === unit.id;
              return (
                <div key={unit.id}
                  onClick={() => setSelected(isSelected ? null : unit)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all group ${isSelected ? 'border-blue-500/40 bg-blue-500/5' : 'border-white/5 bg-white/[0.02] hover:bg-white/5'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot} ${unit.status === 'available' ? 'animate-pulse' : ''}`} />
                      <span className="font-bold text-white text-sm">{unit.vehiclePlate}</span>
                      <span className="text-[10px] text-gray-600 font-bold uppercase bg-white/5 px-1.5 py-0.5 rounded-md">{unit.unitType}</span>
                    </div>
                    <button onClick={e => { e.stopPropagation(); removeUnit(unit); }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400 transition-all">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{unit.driverName} · {unit.driverPhone}</p>
                  <div className="flex items-center gap-2">
                    <select value={unit.status}
                      onClick={e => e.stopPropagation()}
                      onChange={e => updateStatus(unit, e.target.value as AmbulanceUnit['status'])}
                      className={`flex-1 text-xs font-bold px-2 py-1 rounded-lg border bg-transparent focus:outline-none capitalize cursor-pointer [&>option]:bg-[#0d131a] ${cfg.color}`}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button title="Simulate GPS ping"
                      onClick={e => { e.stopPropagation(); simulateLocation(unit); }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-teal-500/10 text-gray-600 hover:text-teal-400 transition-all">
                      <RefreshCw className="w-3 h-3" />
                    </button>
                    {unit.lat && <MapPin className="w-3 h-3 text-teal-400" title={`${unit.lat?.toFixed(4)}, ${unit.lng?.toFixed(4)}`} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Unit form */}
      {adding && (
        <div className="bg-[#0d131a] border border-blue-500/20 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm">Register New Unit</h3>
          <div className="grid grid-cols-2 gap-3">
            {[['vehiclePlate','Vehicle Plate No.','text','e.g. MP09 AB 1234'],
              ['driverName','Driver Name','text','Full Name'],
              ['driverPhone','Driver Phone','tel','+91 XXXXX XXXXX'],
            ].map(([k, l, t, p]) => (
              <div key={k} className={k === 'vehiclePlate' ? 'col-span-2' : ''}>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{l}</label>
                <input type={t} placeholder={p} value={(form as any)[k]}
                  onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none transition-colors placeholder:text-gray-700" />
              </div>
            ))}
            <div>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Unit Type</label>
              <select value={form.unitType} onChange={e => setForm(f => ({ ...f, unitType: e.target.value as AmbulanceUnit['unitType'] }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none [&>option]:bg-[#0d131a]">
                {UNIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={addUnit} disabled={saving}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-xl text-sm transition-all">
              {saving ? 'Registering…' : 'Register Unit'}
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-xl text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
