'use client';
import { useState, useEffect } from 'react';
import { BedDouble, CheckCircle2 } from 'lucide-react';
import type { HospitalProfile } from '@/lib/firestore';

export default function BedsTab({ hp, onSave }: { hp: HospitalProfile; onSave: (f: any) => Promise<void> }) {
  const [form, setForm] = useState({
    totalBeds: hp.totalBeds ?? '0',
    availableBeds: hp.availableBeds ?? '0',
    icuBeds: hp.icuBeds ?? '0',
    availableIcuBeds: hp.availableIcuBeds ?? '0',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ totalBeds: hp.totalBeds ?? '0', availableBeds: hp.availableBeds ?? '0', icuBeds: hp.icuBeds ?? '0', availableIcuBeds: hp.availableIcuBeds ?? '0' });
  }, [hp.totalBeds, hp.availableBeds, hp.icuBeds, hp.availableIcuBeds]);

  const save = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fields = [
    { key: 'totalBeds',      label: 'Total General Beds',  color: 'emerald' },
    { key: 'availableBeds',  label: 'Available General Beds', color: 'emerald' },
    { key: 'icuBeds',        label: 'Total ICU Beds',      color: 'rose' },
    { key: 'availableIcuBeds', label: 'Available ICU Beds', color: 'rose' },
  ] as const;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><BedDouble className="w-5 h-5 text-emerald-400" /> Bed Management</h2>
        <p className="text-sm text-gray-500 mt-1">Update real-time bed availability across general wards and ICU.</p>
      </div>

      {/* Visual bars */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'General Ward', avail: Number(form.availableBeds), total: Number(form.totalBeds), color: 'bg-emerald-500' },
          { label: 'ICU', avail: Number(form.availableIcuBeds), total: Number(form.icuBeds), color: 'bg-rose-500' },
        ].map(s => {
          const pct = s.total > 0 ? Math.round((s.avail / s.total) * 100) : 0;
          return (
            <div key={s.label} className="bg-[#0d131a] border border-white/5 rounded-2xl p-5">
              <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">{s.label}</p>
              <p className="text-3xl font-black text-white">{s.avail}<span className="text-base text-gray-600 font-medium ml-1">/ {s.total}</span></p>
              <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-gray-600 mt-1.5">{pct}% available</p>
            </div>
          );
        })}
      </div>

      {/* Input form */}
      <div className="bg-[#0d131a] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm">Update Counts</h3>
        <div className="grid grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{f.label}</label>
              <input type="number" min="0" value={form[f.key]}
                onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none transition-colors" />
            </div>
          ))}
        </div>
        <button onClick={save} disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(16,185,129,0.25)]">
          {saving ? 'Syncing…' : saved ? <><CheckCircle2 className="w-4 h-4" />Synced to Network</> : 'Save & Sync'}
        </button>
      </div>
    </div>
  );
}
