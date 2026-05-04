'use client';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Droplet, Building2, ArrowRight,
  Mail, Lock, Eye, EyeOff, UserCircle, AlertCircle, CheckCircle2, MapPin
} from 'lucide-react';
import Image from 'next/image';
import { auth, storage } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { saveUserProfile, createUserProfile } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';

type RoleId = 'civilian' | 'donor' | 'hospital' | 'ambulance_driver';

const ROLES: { id: RoleId; icon: typeof User; label: string; desc: string; gradient: string }[] = [
  { id: 'civilian', icon: User, label: 'Civilian', desc: 'Request emergency help', gradient: 'from-blue-500 to-blue-600' },
  { id: 'ambulance_driver', icon: Building2, label: 'Ambulance Driver', desc: 'First responder unit', gradient: 'from-orange-500 to-orange-600' },
  { id: 'donor', icon: Droplet, label: 'Blood Donor', desc: 'Donate & save lives', gradient: 'from-rose-500 to-red-600' }
];

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh',
];

const CITY_MAP: Record<string, string[]> = {
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

const Field = ({ id, label, icon: Icon, type = 'text', placeholder, required = true, options, value, onChange }: any) => (
  <div className="mb-3">
    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">{label}</label>
    <div className="relative flex items-center rounded-2xl border-2 border-gray-100 bg-white transition-all duration-200 hover:border-gray-200 focus-within:border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]">
      <Icon className="absolute left-3.5 w-[18px] h-[18px] text-gray-300" />
      {type === 'select' ? (
        <select name={id} required={required} 
          {...(value !== undefined ? { value, onChange } : { defaultValue: "" })}
          className="w-full bg-transparent rounded-2xl px-4 py-3.5 pl-11 text-sm font-medium text-gray-700 focus:outline-none appearance-none">
          <option value="" disabled>{placeholder}</option>
          {options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : type === 'file' ? (
        <input name={id} type="file" accept="image/*" required={required} className="w-full bg-transparent rounded-2xl px-4 py-3.5 pl-11 text-sm font-medium text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none cursor-pointer" />
      ) : (
        <input name={id} type={type} required={required} placeholder={placeholder}
          className="w-full bg-transparent rounded-2xl px-4 py-3.5 pl-11 text-sm font-medium placeholder:text-gray-300 focus:outline-none" />
      )}
    </div>
  </div>
);

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshProfile, loading: authLoading } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<RoleId>('civilian');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [selState, setSelState] = useState('');
  const [selCity, setSelCity] = useState('');

  useEffect(() => {
    if (searchParams?.get('tab') === 'signup') {
      setIsLogin(false);
    }
  }, [searchParams]);

  const friendlyError = (code: string) => {
    const map: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered. Try logging in.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Try again.',
      'auth/invalid-credential': 'Invalid email or password.',
      'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    };
    return map[code] || `Something went wrong: ${code || 'Unknown error'}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const form = formRef.current!;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('pw') as HTMLInputElement).value;

    try {
      if (!auth) { setError('Firebase not configured.'); setLoading(false); return; }
      
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Logged in successfully!');
      } else {
        const fullName = (form.elements.namedItem('full-name') as HTMLInputElement)?.value || '';
        const phone = (form.elements.namedItem('phone') as HTMLInputElement)?.value || '';
        const city = (form.elements.namedItem('city') as HTMLInputElement)?.value || '';
        const state = (form.elements.namedItem('state') as HTMLInputElement)?.value || '';
        const pincode = (form.elements.namedItem('pincode') as HTMLInputElement)?.value || '';
        const age = (form.elements.namedItem('age') as HTMLInputElement)?.value || '';

        const cred = await createUserWithEmailAndPassword(auth, email, password);
        
        let profileData: any = { role, city, state, email, fullName, phone, age };
        
        if (role === 'civilian') {
          profileData = { ...profileData, pincode,
            emergencyContactPhone: (form.elements.namedItem('emergency-contact') as HTMLInputElement)?.value || '',
            medicalHistory: (form.elements.namedItem('medical-history') as HTMLInputElement)?.value || '',
            currentMedicine: (form.elements.namedItem('current-medicine') as HTMLInputElement)?.value || ''
          };
        } else if (role === 'ambulance_driver') {
          profileData = { ...profileData,
            aadharNo: (form.elements.namedItem('aadhar-no') as HTMLInputElement)?.value || '',
            licenceNo: (form.elements.namedItem('licence-no') as HTMLInputElement)?.value || '',
            vehiclePlate: (form.elements.namedItem('vehicle-no') as HTMLInputElement)?.value || '',
            assignedHospital: (form.elements.namedItem('hospital-name') as HTMLInputElement)?.value || '',
            hospitalAddress: (form.elements.namedItem('hospital-address') as HTMLInputElement)?.value || ''
          };
        } else if (role === 'donor') {
          let photoIdUrl = '';
          const fileInput = form.elements.namedItem('photo-id') as HTMLInputElement;
          if (fileInput && fileInput.files && fileInput.files[0] && storage) {
            try {
              const file = fileInput.files[0];
              const fileRef = ref(storage, `photo_ids/${cred.user.uid}_${file.name}`);
              
              // Upload with 8 second timeout to prevent infinite hangs if Firebase Storage isn't configured
              const uploadPromise = uploadBytes(fileRef, file).then(() => getDownloadURL(fileRef));
              const timeoutPromise = new Promise<string>((_, reject) => setTimeout(() => reject(new Error("Storage upload timed out. Ensure Firebase Storage is configured.")), 8000));
              
              photoIdUrl = await Promise.race([uploadPromise, timeoutPromise]);
            } catch (storageErr: any) {
              console.error("Storage upload error:", storageErr);
              // We'll just continue saving the profile without the photo if storage fails
            }
          }

          profileData = { ...profileData, pincode,
            address: (form.elements.namedItem('address') as HTMLInputElement)?.value || '',
            weight: (form.elements.namedItem('weight') as HTMLInputElement)?.value || '',
            healthInfo: (form.elements.namedItem('health-info') as HTMLInputElement)?.value || '',
            photoId: photoIdUrl || '',
            hemoglobinLevel: (form.elements.namedItem('hemoglobin') as HTMLInputElement)?.value || '',
            lastDonation: (form.elements.namedItem('last-donation') as HTMLInputElement)?.value || ''
          };
        }

        await createUserProfile(cred.user.uid, profileData);
        
        setSuccess('Account created successfully!');
      }
      
      await new Promise(r => setTimeout(r, 800));
      const updatedProfile = await refreshProfile();
      // Use profile role from Firestore (handles hospital users signing in via public login)
      const profileRole = (updatedProfile as any)?.role ?? role;
      if (profileRole === 'hospital') {
        router.push('/hospital/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      console.error("Login/Signup Error:", err);
      setError(err.code ? friendlyError(err.code) : err.message || 'An unknown error occurred');
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      if (!auth) { setError('Firebase not configured.'); setLoading(false); return; }
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      
      // Save basic profile
      await saveUserProfile(cred.user.uid, {
        role,
        ...(role === 'civilian'
          ? { fullName: cred.user.displayName || '', phone: '', dob: '', bloodType: '', allergies: '', medications: '', emergencyContactName: '', emergencyContactPhone: '', email: cred.user.email || '' }
          : role === 'donor'
          ? { fullName: cred.user.displayName || '', phone: '', dob: '', bloodType: '', weight: '', lastDonation: '', conditions: '', address: '', email: cred.user.email || '' }
          : { hospitalName: '', registrationNumber: '', phone: '', address: '', icuBeds: '', ambulances: '', contactPerson: cred.user.displayName || '', contactRole: '', email: cred.user.email || '' }
        ),
      } as any);
      
      setSuccess('Logged in successfully with Google!');
      await new Promise(r => setTimeout(r, 800));
      await refreshProfile();
      
      if (role === 'hospital') {
        router.push('/hospital/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(friendlyError(err.code));
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    const form = formRef.current!;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    if (!email) { setError('Enter your email first.'); return; }
    if (!auth) { setError('Firebase not configured.'); return; }
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 4000);
    } catch (err: any) {
      setError(friendlyError(err.code));
    }
  };

  return (
    <div className="w-full lg:w-1/2 bg-gradient-to-br from-gray-50 via-white to-red-50/20 flex items-start lg:items-center justify-center p-5 sm:p-10 relative overflow-y-auto">
      <div className="absolute top-[-15%] right-[-10%] w-[50%] h-[50%] bg-red-100 opacity-30 rounded-full blur-[100px] pointer-events-none" />
      <div className="lg:hidden absolute top-0 left-0 right-0 h-36 overflow-hidden z-0">
        <Image src="/hero-ambulance.png" alt="Emergency" fill sizes="50vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/80 to-gray-50" />
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] bg-white/80 backdrop-blur-xl rounded-[1.75rem] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.06)] p-7 sm:p-9 relative z-10 border border-gray-200/50 mt-28 lg:mt-0 mb-8 lg:mb-0">
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-md">A</div>
          <span className="text-lg font-extrabold tracking-tight">AeroCare</span>
        </div>

        {/* Portal switcher */}
        <div className="flex bg-gray-100/80 rounded-2xl p-1.5 mb-4 relative">
          <motion.div className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm" initial={false}
            animate={{ left: '6px', width: 'calc(50% - 6px)' }}
            transition={{ type: 'spring', bounce: 0.18, duration: 0.55 }} />
          <button type="button" className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors text-black`}>Public App</button>
          <button type="button" onClick={() => router.push('/hospital')} className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors text-gray-400 hover:text-black`}>Hospital Portal</button>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-gray-100/80 rounded-2xl p-1.5 mb-6 relative">
          <motion.div className="absolute top-1.5 bottom-1.5 bg-white rounded-xl shadow-sm" initial={false}
            animate={{ left: isLogin ? '6px' : '50%', width: 'calc(50% - 6px)' }}
            transition={{ type: 'spring', bounce: 0.18, duration: 0.55 }} />
          <button type="button" onClick={() => { setIsLogin(true); setError(''); }} className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors ${isLogin ? 'text-black' : 'text-gray-400'}`}>Log in</button>
          <button type="button" onClick={() => { setIsLogin(false); setError(''); }} className={`flex-1 py-3 text-sm font-bold rounded-xl relative z-10 transition-colors ${!isLogin ? 'text-black' : 'text-gray-400'}`}>Sign up</button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />{error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="bg-green-50 border border-green-100 text-green-600 text-sm font-bold px-4 py-4 rounded-xl mb-4 flex items-center gap-2 justify-center">
              <CheckCircle2 className="w-5 h-5 shrink-0" />{success}
            </motion.div>
          )}
        </AnimatePresence>

        {!success && (
        <form ref={formRef} onSubmit={submit}>
          <AnimatePresence mode="wait">
            <motion.div key={`${isLogin ? 'login' : 'signup'}-${role}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              
              {!isLogin && (
                <div className="mb-5">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5 block">
                    I am registering as
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((r) => (
                      <motion.button key={r.id} type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setRole(r.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${
                          role === r.id ? `border-transparent bg-gradient-to-br ${r.gradient} text-white shadow-lg` : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-50'
                        }`}>
                        <r.icon className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">{r.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {!isLogin && (
                <div className="max-h-[30vh] md:max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                  {role === 'civilian' && (
                    <>
                      <Field id="full-name" label="Full Name" icon={UserCircle} placeholder="e.g. Anushka Sharma" />
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="phone" label="Contact No." icon={UserCircle} placeholder="Phone" />
                        <Field id="age" label="Age" icon={UserCircle} placeholder="Age" />
                      </div>
                      <Field id="emergency-contact" label="Emergency Contact No." icon={UserCircle} placeholder="Emergency Phone" required={false} />
                      <Field id="medical-history" label="Any Medical History" icon={UserCircle} placeholder="History" required={false} />
                      <Field id="current-medicine" label="Current Medicine" icon={UserCircle} placeholder="Medicine" required={false} />
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="state" label="State" icon={MapPin} type="select" placeholder="Select State" options={INDIAN_STATES} value={selState} onChange={(e: any) => { setSelState(e.target.value); setSelCity(''); }} />
                        <Field id="city" label="City" icon={MapPin} type="select" placeholder="Select City" options={selState && CITY_MAP[selState] ? CITY_MAP[selState] : []} value={selCity} onChange={(e: any) => setSelCity(e.target.value)} disabled={!selState} />
                      </div>
                      <Field id="pincode" label="Pincode" icon={MapPin} placeholder="Pincode" />
                    </>
                  )}
                  {role === 'ambulance_driver' && (
                    <>
                      <Field id="full-name" label="Full Name" icon={UserCircle} placeholder="Driver Name" />
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="aadhar-no" label="Aadhar No." icon={UserCircle} placeholder="Aadhar" />
                        <Field id="licence-no" label="Licence No." icon={UserCircle} placeholder="Licence" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="vehicle-no" label="Vehicle No." icon={UserCircle} placeholder="Vehicle Plate" />
                        <Field id="phone" label="Contact No." icon={UserCircle} placeholder="Phone" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="state" label="State" icon={MapPin} type="select" placeholder="Select State" options={INDIAN_STATES} value={selState} onChange={(e: any) => { setSelState(e.target.value); setSelCity(''); }} />
                        <Field id="city" label="City" icon={MapPin} type="select" placeholder="Select City" options={selState && CITY_MAP[selState] ? CITY_MAP[selState] : []} value={selCity} onChange={(e: any) => setSelCity(e.target.value)} disabled={!selState} />
                      </div>
                      <Field id="hospital-name" label="Hospital Name" icon={Building2} placeholder="Hospital Name" required={false} />
                      <Field id="hospital-address" label="Hospital Address" icon={MapPin} placeholder="Hospital Address" required={false} />
                    </>
                  )}
                  {role === 'donor' && (
                    <>
                      <Field id="full-name" label="Full Name" icon={UserCircle} placeholder="Donor Name" />
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="phone" label="Contact No." icon={UserCircle} placeholder="Phone" />
                        <Field id="age" label="Age" icon={UserCircle} placeholder="Age" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="state" label="State" icon={MapPin} type="select" placeholder="Select State" options={INDIAN_STATES} value={selState} onChange={(e: any) => { setSelState(e.target.value); setSelCity(''); }} />
                        <Field id="city" label="City" icon={MapPin} type="select" placeholder="Select City" options={selState && CITY_MAP[selState] ? CITY_MAP[selState] : []} value={selCity} onChange={(e: any) => setSelCity(e.target.value)} disabled={!selState} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="pincode" label="Pincode" icon={MapPin} placeholder="Pincode" />
                        <Field id="blood-group" label="Blood Group" icon={Droplet} type="select" placeholder="Select" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} required={false} />
                      </div>
                      <Field id="address" label="Address" icon={MapPin} placeholder="Address" required={false} />
                      <div className="grid grid-cols-2 gap-3">
                        <Field id="weight" label="Weight (kg)" icon={UserCircle} placeholder="Weight" required={false} />
                        <Field id="hemoglobin" label="Hemoglobin Level" icon={UserCircle} placeholder="Level" required={false} />
                      </div>
                      <Field id="health-info" label="Health Info" icon={UserCircle} placeholder="Health Info" required={false} />
                      <Field id="last-donation" label="Last Donation Date" icon={UserCircle} placeholder="YYYY-MM-DD" required={false} />
                      <Field id="photo-id" label="Photo ID" icon={UserCircle} type="file" required={false} />
                    </>
                  )}
                </div>
              )}

              <Field id="email" label="Email Address" icon={Mail} type="email"
                placeholder="e.g. hello@example.com" />
                
              <div className="mb-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
                <div className="relative flex items-center rounded-2xl border-2 border-gray-100 bg-white transition-all duration-200 hover:border-gray-200 focus-within:border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.08)]">
                  <Lock className="absolute left-3.5 w-[18px] h-[18px] text-gray-300" />
                  <input name="pw" type={showPw ? 'text' : 'password'} required
                    placeholder={isLogin ? 'Enter your password' : 'Create a strong password (6+ chars)'}
                    className="w-full bg-transparent rounded-2xl px-4 py-3.5 pl-11 pr-11 text-sm font-medium placeholder:text-gray-300 focus:outline-none" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 text-gray-300 hover:text-gray-500 transition-colors">
                    {showPw ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right mt-2 mb-4">
                  <button type="button" onClick={resetPassword} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">
                    {resetSent ? '✓ Reset email sent!' : 'Forgot password?'}
                  </button>
                </div>
              )}

              <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.985 }} disabled={loading}
                className={`w-full py-4 mt-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isLogin ? 'bg-black text-white shadow-[0_6px_16px_-4px_rgba(0,0,0,0.3)]'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_6px_16px_-4px_rgba(239,68,68,0.3)]'
                }`}>
                {loading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                ) : (
                  <>{isLogin ? 'Log in' : `Create ${ROLES.find((r) => r.id === role)?.label} Account`}<ArrowRight className="w-4 h-4" /></>
                )}
              </motion.button>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" /><span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">or</span><div className="flex-1 h-px bg-gray-100" />
          </div>
          <button type="button" onClick={googleLogin} disabled={loading}
            className="w-full py-3 border-2 border-gray-100 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-50 hover:border-gray-200 transition-all flex items-center justify-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </button>
        </form>
        )}
      </motion.div>
    </div>
  );
}

export default function LoginClient() {
  return (
    <div className="flex-1 w-full bg-white flex relative overflow-hidden h-[calc(100vh-60px)] md:h-[calc(100vh-68px)]">
      {/* ── Left Hero ── */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end overflow-hidden">
        <Image src="/hero-ambulance.png" alt="Emergency response" fill sizes="50vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div animate={{ scale: [1, 2.8], opacity: [0.4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }} className="absolute w-12 h-12 rounded-full border-2 border-red-500 -translate-x-1/2 -translate-y-1/2" />
          <motion.div animate={{ scale: [1, 2.8], opacity: [0.3, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.9 }} className="absolute w-12 h-12 rounded-full border-2 border-red-500 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute w-3 h-3 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-[0_0_16px_rgba(239,68,68,0.9)]" />
        </div>
        <div className="relative z-10 p-14 pb-16">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-full text-xs font-bold mb-6 backdrop-blur-md">
              <motion.div animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              Live Emergency Network
            </div>
            <h1 className="text-[3.2rem] font-extrabold text-white tracking-tight leading-[1.08] mb-4">
              Every Second<br /><span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">Counts.</span>
            </h1>
            <p className="text-base text-gray-300 font-medium max-w-md leading-relaxed">Join the AeroCare network — request emergency aid, donate blood, or register your hospital.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex gap-10 mt-8">
            {[{ v: '12K+', l: 'Users' }, { v: '<4 min', l: 'Avg. ETA' }, { v: '340+', l: 'Hospitals' }].map((s) => (
              <div key={s.l}><p className="text-xl font-extrabold text-white">{s.v}</p><p className="text-xs text-gray-400 font-medium">{s.l}</p></div>
            ))}
          </motion.div>
        </div>
      </div>
      <Suspense fallback={<div className="w-1/2 flex items-center justify-center">Loading...</div>}>
        <LoginInner />
      </Suspense>
    </div>
  );
}
