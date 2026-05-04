'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { QrCode, Droplets, AlertCircle, Pill, PhoneCall, ChevronLeft, Share2, LogIn, LogOut, Building2, UserCircle, MapPin, Hash, BedDouble, Ambulance, Calendar, Heart, Weight, Save, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { saveUserProfile, type CivilianProfile, type DonorProfile, type HospitalProfile } from '@/lib/firestore';

export default function ProfileClient() {
  const router = useRouter();
  const [autoShare, setAutoShare] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const { user, profile, signOut, refreshProfile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (!user || !profile) {
    return (
      <div className="flex-1 w-full bg-[#f5f5f7] min-h-screen pb-12 flex flex-col items-center justify-center p-5">
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center max-w-sm w-full border border-gray-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
            <QrCode className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Account Profile</h2>
          <p className="text-sm text-gray-500 mb-6">Log in to view and manage your AeroCare profile.</p>
          <Link href="/login" className="w-full bg-black text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> Log in / Sign up
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setLoading(true);
    
    const form = formRef.current;
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value || '';
    
    let updatedProfile: any = { role: profile.role, email: profile.email };
    
    if (profile.role === 'civilian') {
      updatedProfile = { ...updatedProfile,
        fullName: get('fullName'), phone: get('phone'), dob: get('dob'),
        bloodType: get('bloodType'), allergies: get('allergies'),
        medications: get('medications'), emergencyContactName: get('emergencyContactName'),
        emergencyContactPhone: get('emergencyContactPhone')
      };
    } else if (profile.role === 'donor') {
      updatedProfile = { ...updatedProfile,
        fullName: get('fullName'), phone: get('phone'), dob: get('dob'),
        bloodType: get('bloodType'), weight: get('weight'),
        lastDonation: get('lastDonation'), conditions: get('conditions'), address: get('address')
      };
    } else if (profile.role === 'hospital') {
      updatedProfile = { ...updatedProfile,
        hospitalName: get('hospitalName'), registrationNumber: get('registrationNumber'), phone: get('phone'),
        address: get('address'), icuBeds: get('icuBeds'), ambulances: get('ambulances'),
        contactPerson: get('contactPerson'), contactRole: get('contactRole')
      };
    }

    try {
      await saveUserProfile(user.uid, updatedProfile);
      await refreshProfile();
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const role = profile.role;

  // ── Helper for Edit Fields ──
  const EditField = ({ name, label, defaultValue, type = 'text', required = false }: any) => (
    <div className="mb-3">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">{label}</label>
      <input name={name} type={type} defaultValue={defaultValue} required={required}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-red-500 focus:bg-white transition-colors" />
    </div>
  );

  return (
    <div className="flex-1 w-full bg-[#f5f5f7] min-h-screen pb-12">
      <div className="bg-white px-4 sm:px-6 pt-8 sm:pt-10 pb-4 sm:pb-5 sticky top-[60px] md:top-[68px] z-40 border-b border-gray-100 shadow-sm flex items-center justify-between">
        <Link href="/" className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft className="w-5 h-5" /></Link>
        <h1 className="text-xl font-extrabold tracking-tight flex-1 text-center">
          {role === 'civilian' ? 'Medical ID' : role === 'donor' ? 'Donor Profile' : 'Hospital'}
        </h1>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <button form="edit-form" type="submit" disabled={loading} className="text-sm font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Save className="w-4 h-4" /> {loading ? '...' : 'Save'}
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-1">
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          )}
        </div>
      </div>

      <div className="p-5 max-w-2xl mx-auto flex flex-col gap-4">
        {isEditing ? (
          <motion.form id="edit-form" ref={formRef} onSubmit={handleSave} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <h2 className="font-bold text-lg mb-4">Edit Profile</h2>
            {role === 'civilian' && (
              <>
                <EditField name="fullName" label="Full Name" defaultValue={(profile as CivilianProfile).fullName} required />
                <EditField name="bloodType" label="Blood Type" defaultValue={(profile as CivilianProfile).bloodType} />
                <EditField name="allergies" label="Allergies (comma separated)" defaultValue={(profile as CivilianProfile).allergies} />
                <EditField name="medications" label="Medications (comma separated)" defaultValue={(profile as CivilianProfile).medications} />
                <EditField name="phone" label="Phone Number" defaultValue={(profile as CivilianProfile).phone} type="tel" />
                <EditField name="emergencyContactName" label="Emergency Contact Name" defaultValue={(profile as CivilianProfile).emergencyContactName} />
                <EditField name="emergencyContactPhone" label="Emergency Contact Phone" defaultValue={(profile as CivilianProfile).emergencyContactPhone} type="tel" />
              </>
            )}
            {role === 'donor' && (
              <>
                <EditField name="fullName" label="Full Name" defaultValue={(profile as DonorProfile).fullName} required />
                <EditField name="bloodType" label="Blood Type" defaultValue={(profile as DonorProfile).bloodType} />
                <EditField name="weight" label="Weight (kg)" defaultValue={(profile as DonorProfile).weight} type="number" />
                <EditField name="lastDonation" label="Last Donation Date" defaultValue={(profile as DonorProfile).lastDonation} type="date" />
                <EditField name="conditions" label="Medical Conditions" defaultValue={(profile as DonorProfile).conditions} />
                <EditField name="phone" label="Phone Number" defaultValue={(profile as DonorProfile).phone} type="tel" />
                <EditField name="address" label="Address" defaultValue={(profile as DonorProfile).address} />
              </>
            )}
            {role === 'hospital' && (
              <>
                <EditField name="hospitalName" label="Hospital Name" defaultValue={(profile as HospitalProfile).hospitalName} required />
                <EditField name="registrationNumber" label="Registration Number" defaultValue={(profile as HospitalProfile).registrationNumber} />
                <EditField name="icuBeds" label="ICU Beds" defaultValue={(profile as HospitalProfile).icuBeds} type="number" />
                <EditField name="ambulances" label="Ambulances" defaultValue={(profile as HospitalProfile).ambulances} type="number" />
                <EditField name="contactPerson" label="Contact Person" defaultValue={(profile as HospitalProfile).contactPerson} />
                <EditField name="contactRole" label="Contact Role" defaultValue={(profile as HospitalProfile).contactRole} />
                <EditField name="phone" label="Hospital Phone" defaultValue={(profile as HospitalProfile).phone} type="tel" />
                <EditField name="address" label="Address" defaultValue={(profile as HospitalProfile).address} />
              </>
            )}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button type="button" onClick={() => setIsEditing(false)} className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">Cancel</button>
            </div>
          </motion.form>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-4">
              
              {role === 'civilian' && (
                <>
                  <QrCard name={(profile as CivilianProfile).fullName || 'Unidentified'} subtitle="First responders can scan this from your lock screen." />
                  <AutoShareCard autoShare={autoShare} setAutoShare={setAutoShare} />
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard icon={Droplets} title="Blood Type" value={(profile as CivilianProfile).bloodType || 'N/A'} color="text-red-600" bgColor="bg-red-50" iconColor="text-red-500" />
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
                      <div className="w-9 h-9 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-3"><AlertCircle className="w-4 h-4" /></div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Allergies</p>
                      <h3 className="text-base font-bold mt-1 leading-tight">
                        {((profile as CivilianProfile).allergies ? (profile as CivilianProfile).allergies.split(',').map(s => s.trim()) : ['None reported']).map((a, i) => <span key={i} className="block">{a}</span>)}
                      </h3>
                    </div>
                  </div>
                  <ListCard icon={Pill} title="Current Medications" items={((profile as CivilianProfile).medications ? (profile as CivilianProfile).medications.split(',').map(s => s.trim()) : [])} emptyText="No medications reported" />
                  <ContactCard name={(profile as CivilianProfile).emergencyContactName || 'Not set'} phone={(profile as CivilianProfile).emergencyContactPhone} />
                </>
              )}

              {role === 'donor' && (
                <>
                  <QrCard name={(profile as DonorProfile).fullName || 'Unidentified'} subtitle="Show this to hospital staff when donating blood." />
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard icon={Droplets} title="Blood Type" value={(profile as DonorProfile).bloodType || 'N/A'} color="text-red-600" bgColor="bg-red-50" iconColor="text-red-500" />
                    <InfoCard icon={Weight} title="Weight" value={(profile as DonorProfile).weight ? `${(profile as DonorProfile).weight} kg` : 'N/A'} color="text-gray-900" bgColor="bg-blue-50" iconColor="text-blue-500" />
                  </div>
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-5 flex flex-col gap-4">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Address</p>
                        <p className="font-bold text-sm mt-0.5">{(profile as DonorProfile).address || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Last Donation</p>
                        <p className="font-bold text-sm mt-0.5">{(profile as DonorProfile).lastDonation || 'Never'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Heart className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Medical Conditions</p>
                        <p className="font-bold text-sm mt-0.5">{(profile as DonorProfile).conditions || 'None'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {role === 'hospital' && (
                <>
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-3xl text-white shadow-md">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="font-extrabold text-xl">{(profile as HospitalProfile).hospitalName || 'Hospital Name'}</h2>
                        <p className="text-emerald-100 text-xs font-medium tracking-wide">{(profile as HospitalProfile).registrationNumber || 'No Registration ID'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 bg-black/10 p-3 rounded-xl">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                      <p className="text-sm font-medium leading-tight">{(profile as HospitalProfile).address || 'Address not provided'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <InfoCard icon={BedDouble} title="Available ICU Beds" value={(profile as HospitalProfile).icuBeds || '0'} color="text-gray-900" bgColor="bg-white" iconColor="text-emerald-500" />
                    <InfoCard icon={Ambulance} title="Ambulance Fleet" value={(profile as HospitalProfile).ambulances || '0'} color="text-gray-900" bgColor="bg-white" iconColor="text-emerald-500" />
                  </div>
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contact Person</p>
                        <p className="font-bold text-sm mt-0.5">{(profile as HospitalProfile).contactPerson || 'Not provided'}</p>
                        <p className="text-xs text-gray-400">{(profile as HospitalProfile).contactRole || 'Role not provided'}</p>
                      </div>
                      <UserCircle className="w-8 h-8 text-gray-200" />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Emergency Phone</p>
                        <p className="font-bold text-sm mt-0.5">{(profile as HospitalProfile).phone || 'Not provided'}</p>
                      </div>
                      {(profile as HospitalProfile).phone && (
                        <a href={`tel:${(profile as HospitalProfile).phone}`} className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center transition-colors">
                          <PhoneCall className="w-4 h-4 fill-current" />
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}

              <button onClick={handleSignOut} className="mt-4 w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                <LogOut className="w-4 h-4" /> Sign out completely
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ── Shared Subcomponents ──

function QrCard({ name, subtitle }: { name: string, subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center relative">
      <button className="absolute top-4 right-4 text-gray-300 hover:text-black transition-colors"><Share2 className="w-5 h-5" /></button>
      <div className="w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center mb-4">
        <QrCode className="w-16 h-16 text-black/80" strokeWidth={1} />
      </div>
      <h3 className="font-bold text-lg mb-0.5">{name}</h3>
      <p className="text-xs text-gray-400 font-medium text-center">{subtitle}</p>
    </motion.div>
  );
}

function AutoShareCard({ autoShare, setAutoShare }: { autoShare: boolean, setAutoShare: (val: boolean) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div className="pr-4">
        <h4 className="font-bold text-sm">Auto-Share on Dispatch</h4>
        <p className="text-[11px] text-gray-400 font-medium mt-0.5">Transmit profile to responding units.</p>
      </div>
      <button onClick={() => setAutoShare(!autoShare)} className={`w-[52px] h-[30px] rounded-full relative transition-colors duration-300 shrink-0 ${autoShare ? 'bg-emerald-500' : 'bg-gray-200'}`}>
        <motion.div className="w-[26px] h-[26px] bg-white rounded-full shadow-md absolute top-[2px]" initial={false} animate={{ left: autoShare ? '24px' : '2px' }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
      </button>
    </motion.div>
  );
}

function InfoCard({ icon: Icon, title, value, color, bgColor, iconColor }: { icon: any, title: string, value: string, color: string, bgColor: string, iconColor: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-3xl shadow-sm border border-gray-100 ${bgColor === 'bg-white' ? 'bg-white' : 'bg-white'}`}>
      <div className={`w-9 h-9 ${bgColor} rounded-full flex items-center justify-center ${iconColor} mb-3`}><Icon className="w-4 h-4 fill-current" /></div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      <h3 className={`text-2xl sm:text-3xl font-extrabold mt-1 ${color}`}>{value}</h3>
    </motion.div>
  );
}

function ListCard({ icon: Icon, title, items, emptyText }: { icon: any, title: string, items: string[], emptyText: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
        <Icon className="w-4 h-4 text-gray-400" /><h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-5 flex flex-col gap-3.5">
        {items.length > 0 ? items.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="font-bold text-sm">{item}</span>
            {i < items.length - 1 && <div className="h-px bg-gray-50 absolute" />}
          </div>
        )) : <span className="text-sm text-gray-400 font-medium">{emptyText}</span>}
      </div>
    </motion.div>
  );
}

function ContactCard({ name, phone }: { name: string, phone: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
        <PhoneCall className="w-4 h-4 text-gray-400" /><h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Emergency Contact</h3>
      </div>
      <div className="p-5 flex items-center justify-between">
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-xs text-gray-400">{phone}</p>
        </div>
        {phone && (
          <a href={`tel:${phone}`} className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-sm">
            <PhoneCall className="w-4 h-4 fill-current" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
