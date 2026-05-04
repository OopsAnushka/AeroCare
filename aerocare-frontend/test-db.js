// Test DB directly to see exact Postgres error
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  console.log('Testing RPC directly...');
  const { data, error } = await supabase.rpc('find_nearest_hospitals', { 
    user_lat: 22.7196, 
    user_lon: 75.8577, 
    radius_km: 15 
  });
  
  if (error) {
    console.error('RPC Error:', error);
  } else {
    console.log('RPC Data:', data);
  }
}

test();
