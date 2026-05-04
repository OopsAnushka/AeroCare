// Test script to verify backend APIs
const baseUrl = 'http://localhost:3000/api';

async function runTests() {
  console.log('🧪 Starting Backend API Tests...\n');
  const indoreLat = 22.7196;
  const indoreLon = 75.8577;

  // 1. Test Nearest Hospitals API
  console.log('1️⃣ Testing /api/hospitals/nearest...');
  try {
    const res = await fetch(`${baseUrl}/hospitals/nearest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: indoreLat, longitude: indoreLon })
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const hospitals = await res.json();
    console.log(`✅ Success! Found ${hospitals.length} hospitals nearby.`);
    if (hospitals.length > 0) {
      console.log(`   🏥 Closest: ${hospitals[0].name || hospitals[0].hospital_name} (${hospitals[0].distance_km} km away)`);
    } else {
      console.log('   ⚠️ No hospitals found in the database for this location.');
    }
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
  
  console.log('\n----------------------------------------\n');

  // 2. Test SOS Dispatch API
  console.log('2️⃣ Testing /api/sos/dispatch (Emergency Ambulance Routing)...');
  try {
    const res = await fetch(`${baseUrl}/sos/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: indoreLat, longitude: indoreLon, emergencyType: 'ALS' })
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const dispatch = await res.json();
    console.log(`✅ Success! Ambulance Dispatched.`);
    console.log(`   🚑 Unit: ${dispatch.unitId} (${dispatch.eta})`);
    console.log(`   🏥 Dispatched from: ${dispatch.hospitalName}`);
    console.log(`   📍 Start Coordinates: [${dispatch.startPos[0]}, ${dispatch.startPos[1]}]`);
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
  
  console.log('\n----------------------------------------\n');
  
  // 3. Test Volunteers API
  console.log('3️⃣ Testing /api/samaritans/nearby (Volunteers)...');
  try {
    const res = await fetch(`${baseUrl}/samaritans/nearby`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: indoreLat, longitude: indoreLon, radiusKm: 10 })
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const vols = await res.json();
    console.log(`✅ Success! Found ${vols.length} volunteers nearby.`);
  } catch (err) {
    console.error('❌ Failed:', err.message);
  }

  console.log('\n🏁 Tests Complete!');
}

runTests();
