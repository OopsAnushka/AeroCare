import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { latitude, longitude, resourceType = 'icu_bed' } = await req.json();
    
    if (!latitude || !longitude) {
      return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
    }

    const { data, error } = await supabase.rpc('find_nearest_hospitals', { 
      user_lat: latitude, 
      user_lon: longitude, 
      radius_km: 15 
    });

    if (error) throw error;
    if (!data || data.length === 0) {
      return NextResponse.json({ message: 'No hospitals found in this area.' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Hospital Route Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
