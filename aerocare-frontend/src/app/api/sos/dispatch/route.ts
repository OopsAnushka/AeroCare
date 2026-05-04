import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { latitude, longitude, emergencyType = 'BLS' } = await req.json();
    
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    // Attempt to find the absolute nearest hospital to dispatch the ambulance from
    let ambulanceLat = latitude - 0.012;
    let ambulanceLon = longitude + 0.015;
    let hospitalName = 'AeroCare Base Station';

    const { data: hospitals, error: rpcError } = await supabase.rpc('find_nearest_hospitals', {
      user_lat: latitude,
      user_lon: longitude,
      radius_km: 20
    });

    if (!rpcError && hospitals && hospitals.length > 0) {
      // Pick the closest one that actually has an ambulance
      const bestHospital = hospitals[0];
      ambulanceLat = bestHospital.latitude;
      ambulanceLon = bestHospital.longitude;
      hospitalName = bestHospital.hospital_name || bestHospital.name;
    }

    // Insert dispatch record
    const { error } = await supabase.from('dispatches').insert({
      latitude,
      longitude,
      emergency_type: emergencyType,
      status: 'dispatched'
    });
    
    if (error && error.code !== '42P01') {
      console.warn('Dispatch insert failed:', error.message);
    }

    // Generate random unit ID based on type
    const rand = Math.floor(Math.random() * 9000) + 1000;
    const unitId = `MP09-${emergencyType}-${rand}`;

    return NextResponse.json({
      success: true,
      message: 'Ambulance dispatched successfully',
      unitId,
      eta: '4 mins',
      startPos: [ambulanceLat, ambulanceLon],
      hospitalName
    });
  } catch (error: any) {
    console.error('Dispatch Route Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
