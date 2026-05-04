const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.rpc('find_nearest_hospitals', { user_lat: 22.7, user_lon: 75.8, radius_km: 100 });
  console.log("RPC Error:", error);
  console.log("RPC Data Columns (first row):", data ? Object.keys(data[0] || {}) : "No data");
}

test();
