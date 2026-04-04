"use client";
import React, { useEffect, useState } from "react";

interface HospitalData {
  id: string;
  name: string;
  distance: string;
  address: string;
  beds_available: number;
}

const Hospital = () => {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/hospitals");
        const data = await res.json();
        setHospitals(data);
      } catch (err) {
        console.error("Failed to load hospitals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  if (loading) return <div className="p-4 animate-pulse">Loading hospitals...</div>;

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Nearby Hospitals</h2>
      <div className="space-y-4">
        {hospitals.map((hosp) => (
          <div key={hosp.id} className="flex justify-between items-center p-3 border-b border-gray-100 last:border-0">
            <div>
              <h3 className="font-semibold text-gray-700">{hosp.name}</h3>
              <p className="text-xs text-gray-500">{hosp.address}</p>
              <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                {hosp.distance} km away
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-green-600">{hosp.beds_available}</p>
              <p className="text-[10px] text-gray-400 uppercase">Beds Available</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hospital;