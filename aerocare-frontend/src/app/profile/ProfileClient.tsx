'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { QrCode, Droplets, AlertCircle, Pill, PhoneCall, ChevronLeft, Share2, LogIn, LogOut, Building2, UserCircle, MapPin, Hash, BedDouble, Ambulance, Calendar, Heart, Weight, Save, Edit3, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { saveUserProfile, type CivilianProfile, type DonorProfile, type HospitalProfile } from '@/lib/firestore';

export default function ProfileClient() {
  const router = useRouter();
  const [autoShare, setAutoShare] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addingAmbulance, setAddingAmbulance] = useState(false);
  const [newAmb, setNewAmb] = useState({ plate: '', type: 'BLS', driver: '' });
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
    
    let updatedProfile: any = { ...profile };
    
    if (profile.role === 'civilian') {
      updatedProfile = { ...updatedProfile,
        fullName: get('fullName'), phone: get('phone'), age: get('age'),
        bloodType: get('bloodType'), medicalHistory: get('medicalHistory'),
        currentMedicine: get('currentMedicine'), emergencyContactName: get('emergencyContactName'),
        emergencyContactPhone: get('emergencyContactPhone'),
        city: get('city'), state: get('state'), pincode: get('pincode')
      };
    } else if (profile.role === 'donor') {
      updatedProfile = { ...updatedProfile,
        fullName: get('fullName'), phone: get('phone'), age: get('age'),
        bloodType: get('bloodType'), weight: get('weight'), hemoglobinLevel: get('hemoglobinLevel'),
        lastDonation: get('lastDonation'), healthInfo: get('healthInfo'), address: get('address'),
        city: get('city'), state: get('state'), pincode: get('pincode')
      };
    } else if (profile.role === 'hospital') {
      updatedProfile = { ...updatedProfile,
        hospitalName: get('hospitalName'), phone: get('phone'),
        address: get('address'), icuBeds: get('icuBeds'), ambulances: get('ambulances'),
        contactPerson: get('contactPerson')
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

  const handleAddAmbulance = async () => {
    if (!newAmb.plate) return;
    const currentAmbs = (profile as HospitalProfile).ambulances_list || [];
    const updated = [...currentAmbs, newAmb];
    
    try {
      await saveUserProfile(user.uid, { ...profile, ambulances_list: updated } as any);
      await refreshProfile();
      setAddingAmbulance(false);
      setNewAmb({ plate: '', type: 'BLS', driver: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveAmbulance = async (idx: number) => {
    const currentAmbs = [...((profile as HospitalProfile).ambulances_list || [])];
    currentAmbs.splice(idx, 1);
    try {
      await saveUserProfile(user.uid, { ...profile, ambulances_list: currentAmbs } as any);
      await refreshProfile();
    } catch (err) {
      console.error(err);
    }
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
                <div className="grid grid-cols-2 gap-3">
                  <EditField name="phone" label="Phone" defaultValue={(profile as CivilianProfile).phone} type="tel" />
                  <EditField name="age" label="Age" defaultValue={(profile as CivilianProfile).age} />
                </div>
                <EditField name="bloodType" label="Blood Type" defaultValue={(profile as CivilianProfile).bloodType} />
                <EditField name="medicalHistory" label="Medical History" defaultValue={(profile as CivilianProfile).medicalHistory} />
                <EditField name="currentMedicine" label="Current Medicine" defaultValue={(profile as CivilianProfile).currentMedicine} />
                <div className="grid grid-cols-2 gap-3">
                  <EditField name="emergencyContactName" label="Emergency Contact Name" defaultValue={(profile as CivilianProfile).emergencyContactName} />
                  <EditField name="emergencyContactPhone" label="Emergency Contact Phone" defaultValue={(profile as CivilianProfile).emergencyContactPhone} type="tel" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <EditField name="city" label="City" defaultValue={(profile as CivilianProfile).city} />
                  <EditField name="state" label="State" defaultValue={(profile as CivilianProfile).state} />
                  <EditField name="pincode" label="Pincode" defaultValue={(profile as CivilianProfile).pincode} />
                </div>
              </>
            )}
            {role === 'donor' && (
              <>
                <EditField name="fullName" label="Full Name" defaultValue={(profile as DonorProfile).fullName} required />
                <div className="grid grid-cols-2 gap-3">
                  <EditField name="phone" label="Phone" defaultValue={(profile as DonorProfile).phone} type="tel" />
                  <EditField name="age" label="Age" defaultValue={(profile as DonorProfile).age} />
                </div>
                <EditField name="bloodType" label="Blood Type" defaultValue={(profile as DonorProfile).bloodType} />
                <div className="grid grid-cols-2 gap-3">
                  <EditField name="weight" label="Weight (kg)" defaultValue={(profile as DonorProfile).weight} type="number" />
                  <EditField name="hemoglobinLevel" label="Hemoglobin" defaultValue={(profile as DonorProfile).hemoglobinLevel} />
                </div>
                <EditField name="healthInfo" label="Health Info" defaultValue={(profile as DonorProfile).healthInfo} />
                <EditField name="lastDonation" label="Last Donation Date" defaultValue={(profile as DonorProfile).lastDonation} type="date" />
                <EditField name="address" label="Address" defaultValue={(profile as DonorProfile).address} />
                <div className="grid grid-cols-3 gap-2">
                  <EditField name="city" label="City" defaultValue={(profile as DonorProfile).city} />
                  <EditField name="state" label="State" defaultValue={(profile as DonorProfile).state} />
                  <EditField name="pincode" label="Pincode" defaultValue={(profile as DonorProfile).pincode} />
                </div>
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
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Medical History</p>
                      <h3 className="text-base font-bold mt-1 leading-tight">
                        {((profile as CivilianProfile).medicalHistory || '').split(',').map(s => s.trim()).filter(Boolean).length > 0 ? ((profile as CivilianProfile).medicalHistory || '').split(',').map(s => s.trim()).filter(Boolean).map((a, i) => <span key={i} className="block">{a}</span>) : <span className="block">None reported</span>}
                      </h3>
                    </div>
                  </div>
                  <ListCard icon={Pill} title="Current Medications" items={((profile as CivilianProfile).currentMedicine || '').split(',').map(s => s.trim()).filter(Boolean)} emptyText="No medications reported" />
                  <ContactCard name={(profile as CivilianProfile).emergencyContactName || 'Not set'} phone={(profile as CivilianProfile).emergencyContactPhone || ''} />
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
                    <InfoCard icon={Ambulance} title="Ambulance Fleet" value={((profile as HospitalProfile).ambulances?.length || 0).toString()} color="text-gray-900" bgColor="bg-white" iconColor="text-emerald-500" />
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

                  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                      <div className="flex items-center gap-2">
                        <Ambulance className="w-4 h-4 text-gray-400" />
                        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Registered Ambulance Fleet</h3>
                      </div>
                      <button onClick={() => setAddingAmbulance(!addingAmbulance)} className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:border-black transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="p-5 flex flex-col gap-3">
                      {addingAmbulance && (
                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col gap-3 mb-2">
                          <input type="text" placeholder="License Plate (e.g. MP09-AB-1234)" value={newAmb.plate} onChange={(e) => setNewAmb({...newAmb, plate: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:border-red-500 focus:outline-none" />
                          <div className="flex gap-2">
                            <select value={newAmb.type} onChange={(e) => setNewAmb({...newAmb, type: e.target.value})} className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:outline-none">
                              <option value="BLS">BLS Unit</option>
                              <option value="ALS">ALS Unit</option>
                            </select>
                            <input type="text" placeholder="Driver Name" value={newAmb.driver} onChange={(e) => setNewAmb({...newAmb, driver: e.target.value})} className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium focus:border-red-500 focus:outline-none" />
                          </div>
                          <button onClick={handleAddAmbulance} className="bg-black text-white py-2 rounded-xl text-sm font-bold mt-1">Save Vehicle</button>
                        </div>
                      )}

                      {((profile as HospitalProfile).ambulances_list || []).length > 0 ? (
                        ((profile as HospitalProfile).ambulances_list || []).map((amb: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50/50">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                                <Ambulance className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm flex items-center gap-2">
                                  {amb.plate} 
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-md text-white ${amb.type === 'ALS' ? 'bg-red-500' : 'bg-blue-500'}`}>{amb.type}</span>
                                </h4>
                                <p className="text-xs text-gray-500 font-medium">Driver: {amb.driver || 'Unassigned'}</p>
                              </div>
                            </div>
                            <button onClick={() => handleRemoveAmbulance(i)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-400 font-medium py-2">No individual vehicles registered yet.</p>
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
