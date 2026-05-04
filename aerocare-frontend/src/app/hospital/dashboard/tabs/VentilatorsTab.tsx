'use client';
import { useState, useEffect } from 'react';
import { Wind, CheckCircle2 } from 'lucide-react';
import type { HospitalProfile } from '@/lib/firestore';

export default function VentilatorsTab({ hp, onSave }: { hp: HospitalProfile; onSave: (f: any) => Promise<void> }) {
  const [form, setForm] = useState({
    ventilators: hp.ventilators ?? '0',
    availableVentilators: hp.availableVentilators ?? '0',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ ventilators: hp.ventilators ?? '0', availableVentilators: hp.availableVentilators ?? '0' });
  }, [hp.ventilators, hp.availableVentilators]);

  const save = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const total = Number(form.ventilators);
  const avail = Number(form.availableVentilators);
  const pct = total > 0 ? Math.round((avail / total) * 100) : 0;
  const inUse = Math.max(0, total - avail);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><Wind className="w-5 h-5 text-blue-400" /> Ventilator Management</h2>
        <p className="text-sm text-gray-500 mt-1">Track life-support ventilator availability across your facility.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Units', value: total, color: 'text-white' },
          { label: 'Available', value: avail, color: 'text-emerald-400' },
          { label: 'In Use', value: inUse, color: 'text-rose-400' },
        ].map(s => (
          <div key={s.label} className="bg-[#0d131a] border border-white/5 rounded-2xl p-5 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{s.label}</p>
            <p className={`text-4xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#0d131a] border border-white/5 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Availability</span>
          <span className="text-xs font-bold text-blue-400">{pct}%</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="bg-[#0d131a] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm">Update Counts</h3>
        <div className="grid grid-cols-2 gap-4">
          {([['ventilators', 'Total Ventilators'], ['availableVentilators', 'Available Ventilators']] as const).map(([k, l]) => (
            <div key={k}>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{l}</label>
              <input type="number" min="0" value={form[k]}
                onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none transition-colors" />
            </div>
          ))}
        </div>
        <button onClick={save} disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(59,130,246,0.25)]">
          {saving ? 'Syncing…' : saved ? <><CheckCircle2 className="w-4 h-4" />Synced</> : 'Save & Sync'}
        </button>
      </div>
    </div>
  );
}
