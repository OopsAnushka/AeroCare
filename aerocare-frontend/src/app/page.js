import { Activity, Droplet, Hospital, Navigation } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-200 shadow-sm py-4 px-6 flex items-center justify-center sm:justify-start">
        <div className="flex items-center gap-3">
          <Activity className="text-red-600 w-7 h-7" />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AeroCare: Emergency Dispatch
          </h1>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="w-full max-w-5xl flex flex-col items-center flex-1 p-6 md:p-12">
        
        {/* HERO SECTION: The SOS Button */}
        <div className="flex flex-col items-center justify-center mt-8 mb-16 w-full">
          {/* Button Container with Animation */}
          <div className="relative flex items-center justify-center mt-8 mb-6">
            <div className="absolute w-56 h-56 bg-red-500 rounded-full animate-ping opacity-20"></div>
            <div className="absolute w-48 h-48 bg-red-500 rounded-full animate-pulse opacity-40"></div>
            
            {/* Main Interactive Button */}
            <button className="relative z-10 w-40 h-40 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white rounded-full shadow-2xl flex items-center justify-center text-5xl font-extrabold tracking-widest transition-transform duration-200 hover:scale-105 active:scale-95 border-4 border-white">
              SOS
            </button>
          </div>
          
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-widest text-center">
            TAP FOR EMERGENCY DISPATCH
          </h2>
          <p className="mt-3 text-sm md:text-base text-slate-500 text-center max-w-lg font-medium px-4">
            Instantly alerts the nearest BLS/ALS ambulance, checks live hospital bed availability, and pings nearby CPR volunteers.
          </p>
        </div>

        {/* MODULE CARDS: 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* Card 1: Blood Donor Network */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer">
            <div className="bg-red-50 p-4 rounded-full mb-4 group-hover:bg-red-100 transition-colors">
              <Droplet className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Blood Donor Network</h3>
            <p className="text-sm text-slate-500 font-medium">Locate and ping nearby verified blood donors instantly.</p>
          </div>

          {/* Card 2: Hospital Routing */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer">
            <div className="bg-blue-50 p-4 rounded-full mb-4 group-hover:bg-blue-100 transition-colors">
              <Hospital className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Hospital Routing</h3>
            <p className="text-sm text-slate-500 font-medium">Smart routing based on live ICU & Ventilator availability.</p>
          </div>

          {/* Card 3: Good Samaritan Radar */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer">
            <div className="bg-green-50 p-4 rounded-full mb-4 group-hover:bg-green-100 transition-colors">
              <Navigation className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Good Samaritan Radar</h3>
            <p className="text-sm text-slate-500 font-medium">Ping nearby CPR-certified volunteers for immediate assistance.</p>
          </div>

        </div>
        
      </main>
    </div>
  );
}