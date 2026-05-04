'use client';
import { useState, useEffect } from 'react';
import { Stethoscope, CheckCircle2 } from 'lucide-react';
import type { HospitalProfile } from '@/lib/firestore';

export default function OTTab({ hp, onSave }: { hp: HospitalProfile; onSave: (f: any) => Promise<void> }) {
  const [form, setForm] = useState({
    operationTheatres: hp.operationTheatres ?? '0',
    availableOTs: hp.availableOTs ?? '0',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ operationTheatres: hp.operationTheatres ?? '0', availableOTs: hp.availableOTs ?? '0' });
  }, [hp.operationTheatres, hp.availableOTs]);

  const save = async () => { setSaving(true); await onSave(form); setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const total = Number(form.operationTheatres);
  const avail = Number(form.availableOTs);
  const inUse = Math.max(0, total - avail);
  const pct = total > 0 ? Math.round((avail / total) * 100) : 0;

  const otStatuses = Array.from({ length: total }, (_, i) => ({
    id: i + 1, status: i < inUse ? 'in-use' : 'available',
  }));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><Stethoscope className="w-5 h-5 text-amber-400" /> Operation Theatres</h2>
        <p className="text-sm text-gray-500 mt-1">Manage and broadcast your OT availability in real time.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{ l: 'Total OTs', v: total, c: 'text-white' }, { l: 'Available', v: avail, c: 'text-emerald-400' }, { l: 'In Surgery', v: inUse, c: 'text-amber-400' }].map(s => (
          <div key={s.l} className="bg-[#0d131a] border border-white/5 rounded-2xl p-5 text-center">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{s.l}</p>
            <p className={`text-4xl font-black ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Visual OT grid */}
      {otStatuses.length > 0 && (
        <div className="bg-[#0d131a] border border-white/5 rounded-2xl p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">OT Status Board</p>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {otStatuses.map(ot => (
              <div key={ot.id} className={`aspect-square rounded-xl flex flex-col items-center justify-center border text-xs font-bold transition-all ${
                ot.status === 'available' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                <span className="text-lg font-black">{ot.id}</span>
                <span className="text-[9px] uppercase tracking-wide opacity-70">{ot.status === 'available' ? 'Free' : 'Active'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#0d131a] border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-white text-sm">Update OT Counts</h3>
        <div className="grid grid-cols-2 gap-4">
          {([['operationTheatres', 'Total OT Rooms'], ['availableOTs', 'Available OTs']] as const).map(([k, l]) => (
            <div key={k}>
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">{l}</label>
              <input type="number" min="0" value={form[k]}
                onChange={e => setForm(v => ({ ...v, [k]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 focus:border-amber-500/50 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none transition-colors" />
            </div>
          ))}
        </div>
        <button onClick={save} disabled={saving}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(245,158,11,0.25)]">
          {saving ? 'Syncing…' : saved ? <><CheckCircle2 className="w-4 h-4" />Synced</> : 'Save & Sync'}
        </button>
      </div>
    </div>
  );
}
