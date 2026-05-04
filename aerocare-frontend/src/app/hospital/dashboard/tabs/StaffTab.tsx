'use client';
import { useState } from 'react';
import { Users, Plus, Trash2, UserCheck } from 'lucide-react';
import { db } from '@/lib/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import type { HospitalProfile, StaffMember } from '@/lib/firestore';

const SHIFTS  = ['morning', 'evening', 'night'] as const;
const STATUS  = ['on-duty', 'off-duty', 'on-leave'] as const;
const ROLES   = ['Doctor','Nurse','Paramedic','Technician','Surgeon','Anaesthesiologist','Ward Boy','Receptionist'];
const DEPTS   = ['Emergency','ICU','OT','General Ward','Radiology','Pharmacy','Paediatrics','Cardiology','Neurology'];

const statusColor: Record<string, string> = {
  'on-duty': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'off-duty': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  'on-leave': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export default function StaffTab({ hp, userId }: { hp: HospitalProfile; onSave: (f: any) => Promise<void>; userId: string }) {
  const staff = hp.staff ?? [];
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Partial<StaffMember>>({ shift: 'morning', status: 'on-duty' });
  const [saving, setSaving] = useState(false);
  const [filterShift, setFilterShift] = useState<string>('all');

  const addStaff = async () => {
    if (!form.name || !form.role || !form.department) return;
    setSaving(true);
    const member: StaffMember = {
      id: crypto.randomUUID(),
      name: form.name!, role: form.role!, department: form.department!,
      phone: form.phone ?? '', shift: form.shift ?? 'morning', status: form.status ?? 'on-duty',
    };
    if (db) await updateDoc(doc(db, 'users', userId), { staff: arrayUnion(member), updatedAt: serverTimestamp() });
    setForm({ shift: 'morning', status: 'on-duty' }); setSaving(false); setAdding(false);
  };

  const removeStaff = async (member: StaffMember) => {
    if (!db) return;
    await updateDoc(doc(db, 'users', userId), { staff: arrayRemove(member), updatedAt: serverTimestamp() });
  };

  const updateStatus = async (member: StaffMember, newStatus: StaffMember['status']) => {
    if (!db) return;
    const updated = staff.map(s => s.id === member.id ? { ...s, status: newStatus } : s);
    await updateDoc(doc(db, 'users', userId), { staff: updated, updatedAt: serverTimestamp() });
  };

  const filtered = filterShift === 'all' ? staff : staff.filter(s => s.shift === filterShift);
  const onDuty = staff.filter(s => s.status === 'on-duty').length;

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2"><Users className="w-5 h-5 text-purple-400" /> Staff Directory</h2>
          <p className="text-sm text-gray-500 mt-1">{onDuty} of {staff.length} staff currently on duty.</p>
        </div>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-xl text-sm font-bold transition-all">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-4">
        {[{ l: 'Total Staff', v: staff.length, c: 'text-white' }, { l: 'On Duty', v: onDuty, c: 'text-emerald-400' }, { l: 'Off / Leave', v: staff.length - onDuty, c: 'text-gray-400' }].map(s => (
          <div key={s.l} className="bg-[#0d131a] border border-white/5 rounded-2xl p-4 text-center">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">{s.l}</p>
            <p className={`text-3xl font-black ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', ...SHIFTS].map(s => (
          <button key={s} onClick={() => setFilterShift(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${filterShift === s ? 'bg-purple-500 text-white' : 'bg-white/5 text-gray-500 hover:text-white'}`}>
            {s === 'all' ? 'All Shifts' : `${s} shift`}
          </button>
        ))}
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-[#0d131a] border border-purple-500/20 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-white text-sm">Add Staff Member</h3>
          <div className="grid grid-cols-2 gap-3">
            {[['name','Full Name','text'], ['phone','Phone Number','tel']].map(([k, l, t]) => (
              <div key={k}>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{l}</label>
                <input type={t} value={(form as any)[k] ?? ''} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50" />
              </div>
            ))}
            {[['role', ROLES, 'Role / Designation'], ['department', DEPTS, 'Department'], ['shift', SHIFTS as unknown as string[], 'Shift'], ['status', STATUS as unknown as string[], 'Status']].map(([k, opts, l]) => (
              <div key={k as string}>
                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">{l as string}</label>
                <select value={(form as any)[k as string] ?? ''} onChange={e => setForm(f => ({ ...f, [k as string]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none [&>option]:bg-[#0d131a] capitalize">
                  {(opts as string[]).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={addStaff} disabled={saving} className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl text-sm transition-all">
              {saving ? 'Adding…' : 'Add Member'}
            </button>
            <button onClick={() => setAdding(false)} className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 font-bold rounded-xl text-sm transition-all">Cancel</button>
          </div>
        </div>
      )}

      {/* Staff list */}
      {filtered.length === 0 ? (
        <div className="bg-[#0d131a] border border-white/5 rounded-2xl p-10 text-center">
          <UserCheck className="w-10 h-10 text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No staff members found. Add your first staff member above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(s => (
            <div key={s.id} className="bg-[#0d131a] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center justify-center font-bold text-purple-400 text-sm shrink-0">
                  {s.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.role} · {s.department} · <span className="capitalize">{s.shift} shift</span></p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select value={s.status} onChange={e => updateStatus(s, e.target.value as StaffMember['status'])}
                  className={`text-xs font-bold px-2 py-1 rounded-lg border bg-transparent focus:outline-none capitalize cursor-pointer [&>option]:bg-[#0d131a] ${statusColor[s.status]}`}>
                  {STATUS.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
                <button onClick={() => removeStaff(s)} className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-600 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
