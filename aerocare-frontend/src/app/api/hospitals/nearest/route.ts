import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function POST(req: Request) {
  try {
    const { latitude, longitude } = await req.json();
    
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
    }

    const hospitalsRef = collection(db, 'users');
    const q = query(hospitalsRef, where('role', '==', 'hospital'));
    const snapshot = await getDocs(q);
    
    const hospitals: any[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const hLat = data.lat ?? latitude; 
      const hLon = data.lng ?? longitude;
      const distance = haversineDistance(latitude, longitude, hLat, hLon);

      if (distance <= 50) {
        hospitals.push({
          id: doc.id,
          name: data.hospitalName || 'Unknown Hospital',
          available_beds: parseInt(data.availableIcuBeds || data.availableBeds || '0', 10),
          distance_km: distance.toFixed(2),
          latitude: hLat,
          longitude: hLon
        });
      }
    });

    hospitals.sort((a, b) => parseFloat(a.distance_km) - parseFloat(b.distance_km));

    return NextResponse.json(hospitals);
  } catch (error: any) {
    console.error('Hospital Route Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

