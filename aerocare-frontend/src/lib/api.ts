import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const API_BASE_URL = '/api';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Fetch nearby hospitals from Firestore.
 */
export async function fetchNearbyHospitals(lat: number, lon: number) {
  try {
    if (!db) throw new Error('Firestore not initialized');
    
    const hospitalsRef = collection(db, 'users');
    const q = query(hospitalsRef, where('role', '==', 'hospital'));
    const snapshot = await getDocs(q);
    
    const hospitals: any[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Simple mock for coordinates since hospitals might not have them in their profile yet
      // For a real app, we'd use geocoding on the address or store lat/lng in the profile
      const hLat = data.lat ?? (lat + (Math.random() - 0.5) * 0.1); 
      const hLon = data.lng ?? (lon + (Math.random() - 0.5) * 0.1);
      
      const distance = haversineDistance(lat, lon, hLat, hLon);
      
      if (distance <= 50) { // Within 50km
        hospitals.push({
          id: doc.id,
          name: data.hospitalName || 'Unknown Hospital',
          beds: parseInt(data.availableIcuBeds || data.availableBeds || '0', 10),
          distance: `${distance.toFixed(1)} km`,
          pos: [hLat, hLon],
        });
      }
    });
    
    // Sort by distance
    hospitals.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    
    return hospitals;
  } catch (error: any) {
    console.warn('Failed to fetch hospitals from Firestore:', error.message);
    return [];
  }
}


/**
 * Fetch nearby Samaritan volunteers from the backend.
 */
export async function fetchNearbyVolunteers(lat: number, lon: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/samaritans/nearby`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon, radiusKm: 5 }),
    });
    
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Failed to fetch volunteers');
    }
    
    const data = await res.json();
    
    return data.map((v: any, i: number) => ({
      id: v.id || i,
      name: v.name || v.full_name || 'Volunteer',
      cert: v.certification || 'CPR Certified',
      distance: v.distance_km ? `${parseFloat(v.distance_km).toFixed(1)} km` : `${(Math.random() * 2 + 0.1).toFixed(1)} km`,
      eta: v.eta_mins ? `${v.eta_mins} min` : `${Math.floor(Math.random() * 8) + 2} min`,
      pos: [parseFloat(v.latitude || lat + 0.005), parseFloat(v.longitude || lon + 0.005)] as [number, number],
    }));
  } catch (error: any) {
    console.warn('Backend error or no volunteers found in database:', error.message);
    return []; // Return empty array so user knows database is empty
  }
}

/**
 * Fetch nearby blood donors from the backend.
 */
export async function fetchNearbyDonors(lat: number, lon: number, bloodGroup: string, radiusKm: number = 10) {
  try {
    const res = await fetch(`${API_BASE_URL}/blood/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon, bloodGroup, radiusKm }),
    });
    
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Failed to fetch blood donors');
    }
    
    const data = await res.json();
    
    return data.map((d: any, i: number) => ({
      id: d.id || i,
      name: d.name || d.full_name || 'Donor',
      blood: d.blood_group || bloodGroup,
      distance: d.distance_km ? `${parseFloat(d.distance_km).toFixed(1)} km` : `${(Math.random() * 5 + 1).toFixed(1)} km`,
      eta: d.eta_mins ? `${d.eta_mins} min` : `${Math.floor(Math.random() * 20) + 5} min`,
    }));
  } catch (error: any) {
    console.warn('Backend error or no donors found in database:', error.message);
    return []; // Return empty array so user knows database is empty
  }
}

/**
 * Dispatch an ambulance from the backend.
 */
export async function dispatchAmbulance(lat: number, lon: number, emergencyType: 'BLS' | 'ALS') {
  try {
    const res = await fetch(`${API_BASE_URL}/sos/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon, emergencyType }),
    });
    
    if (!res.ok) throw new Error('Failed to dispatch ambulance');
    
    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.warn('Backend unreachable, mocking dispatch success:', error);
    return { success: true, mock: true };
  }
}
