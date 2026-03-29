"use client";

import { useState } from "react";
import Link from "next/link";
import { Hospital, Navigation, Droplet, ArrowLeft, Activity } from "lucide-react";

export default function Register() {
  const [role, setRole] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Registration logic for ${role} will connect to your backend here!`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50">
      {/* Simple Header */}
      <nav className="w-full bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="text-red-600 w-6 h-6" />
          <span className="font-bold text-slate-900">AeroCare</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </nav>

      <main className="w-full max-w-4xl flex flex-col items-center flex-1 p-6 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Join the AeroCare Network</h1>
          <p className="text-slate-500">Select your role to register for the emergency dispatch platform.</p>
        </div>

        {/* STEP 1: ROLE SELECTION */}
        {!role && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <button onClick={() => setRole("hospital")} className="bg-white p-8 rounded-2xl border-2 border-transparent hover:border-blue-500 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
                <Hospital className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Hospital / Ambulance</h3>
              <p className="text-sm text-slate-500">Register your facility to receive emergency routing and live ICU updates.</p>
            </button>

            <button onClick={() => setRole("samaritan")} className="bg-white p-8 rounded-2xl border-2 border-transparent hover:border-green-500 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="bg-green-50 p-4 rounded-full mb-4 group-hover:bg-green-100 transition-colors">
                <Navigation className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Good Samaritan</h3>
              <p className="text-sm text-slate-500">Sign up as a CPR-certified volunteer to be pinged for nearby emergencies.</p>
            </button>

            <button onClick={() => setRole("donor")} className="bg-white p-8 rounded-2xl border-2 border-transparent hover:border-red-500 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group">
              <div className="bg-red-50 p-4 rounded-full mb-4 group-hover:bg-red-100 transition-colors">
                <Droplet className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Blood Donor</h3>
              <p className="text-sm text-slate-500">Join the live donor network to be alerted for urgent local blood shortages.</p>
            </button>
          </div>
        )}

        {/* STEP 2: DYNAMIC FORMS */}
        {role && (
          <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800 capitalize">
                {role === "hospital" && "Facility Registration"}
                {role === "samaritan" && "Volunteer Registration"}
                {role === "donor" && "Donor Registration"}
              </h2>
              <button onClick={() => setRole(null)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Change Role
              </button>
            </div>

            <form onSubmit={handleRegister} className="flex flex-col gap-4">
              {/* Universal Fields */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  {role === "hospital" ? "Facility Name" : "Full Name"}
                </label>
                <input type="text" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder={role === "hospital" ? "City General Hospital" : "John Doe"} />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label>
                <input type="tel" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="+91 XXXXX XXXXX" />
              </div>

              {/* Specific Fields: Hospital */}
              {role === "hospital" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Live ICU Beds</label>
                      <input type="number" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. 12" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Available Ambulances</label>
                      <input type="number" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g. 3" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Facility Address</label>
                    <textarea required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Full street address..." rows={2}></textarea>
                  </div>
                </>
              )}

              {/* Specific Fields: Samaritan */}
              {role === "samaritan" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">CPR Certification</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>Yes, currently certified</option>
                      <option>Previously certified (Expired)</option>
                      <option>No, but willing to assist</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 rounded text-green-600 focus:ring-green-500" required />
                    <span className="text-sm font-medium text-slate-700">I agree to share my live location during local emergencies.</span>
                  </label>
                </>
              )}

              {/* Specific Fields: Blood Donor */}
              {role === "donor" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Blood Type</label>
                    <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>A+</option><option>A-</option>
                      <option>B+</option><option>B-</option>
                      <option>AB+</option><option>AB-</option>
                      <option>O+</option><option>O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Date of Last Donation</label>
                    <input type="date" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </>
              )}

              <button type="submit" className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Complete Registration
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}