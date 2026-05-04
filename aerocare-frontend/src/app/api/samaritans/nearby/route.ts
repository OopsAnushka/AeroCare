import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { latitude, longitude, radiusKm = 5 } = await req.json();
    
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('find_nearby_volunteers', { 
      user_lat: latitude, 
      user_lon: longitude, 
      radius_km: radiusKm 
    });

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No volunteers found in this area.' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Samaritans Route Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
