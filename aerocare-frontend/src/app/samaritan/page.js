import Link from "next/link";

export default function SamaritanRadar() {
  return (
    <div className="flex flex-col items-center p-6 md:p-12 min-h-screen bg-slate-50">
      
      {/* Top Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Good Samaritan Radar</h1>
        <Link href="/" className="bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 px-4 rounded-full font-medium transition-colors">
          Back
        </Link>
      </div>

      {/* Map Placeholder */}
      <div className="w-full max-w-4xl h-96 bg-gray-200 rounded-xl flex justify-center items-center border-2 border-dashed border-gray-300 mb-8 shadow-inner">
        <p className="text-xl font-bold text-gray-400">Live Radar Map Placeholder</p>
      </div>

      {/* Action Button */}
      <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 text-lg">
        Scan for Nearby CPR Volunteers
      </button>

    </div>
  );
}