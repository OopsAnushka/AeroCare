import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { latitude, longitude, bloodGroup, radiusKm = 10 } = await req.json();
    
    if (!latitude || !longitude || !bloodGroup) {
      return NextResponse.json({ error: 'Latitude, longitude and bloodGroup are required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('find_nearby_donors', { 
      user_lat: latitude, 
      user_lon: longitude, 
      req_blood_group: bloodGroup,
      radius_km: radiusKm 
    });

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No blood donors found in this area.' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Blood Donors Route Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
