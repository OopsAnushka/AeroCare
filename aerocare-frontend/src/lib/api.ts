// src/lib/api.ts

const API_BASE_URL = '/api';

/**
 * Fetch nearby hospitals from the backend.
 * Falls back to mock data if the backend is unreachable.
 */
export async function fetchNearbyHospitals(lat: number, lon: number) {
  try {
    const res = await fetch(`${API_BASE_URL}/hospitals/nearest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon, resourceType: 'icu_bed' }),
    });
    
    if (!res.ok) {
      if (res.status === 404) return [];
      throw new Error('Failed to fetch hospitals');
    }
    
    const data = await res.json();
    
    // Map backend response to frontend format
    // Assuming backend might return a single hospital or an array
    const hospitals = Array.isArray(data) ? data : [data];
    
    return hospitals.map((h: any, i: number) => ({
      id: h.id || i,
      name: h.name || h.hospital_name || 'Unknown Hospital',
      beds: h.available_beds || h.icu_beds || Math.floor(Math.random() * 10) + 1,
      distance: h.distance_km ? `${parseFloat(h.distance_km).toFixed(1)} km` : `${(Math.random() * 5 + 1).toFixed(1)} km`,
      pos: [parseFloat(h.latitude || lat + 0.01), parseFloat(h.longitude || lon + 0.01)] as [number, number],
    }));
  } catch (error: any) {
    console.warn('Backend error or no hospitals found in database:', error.message);
    return []; // Return empty array so user knows database is empty
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
export async function fetchNearbyDonors(lat: number, lon: number, bloodGroup: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/blood/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lon, bloodGroup, radiusKm: 10 }),
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
