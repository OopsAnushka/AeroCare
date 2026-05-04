const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seed() {
  console.log('Seeding authentic Indore hospitals into Supabase...');

  const hospitals = [
    { name: 'Bombay Hospital Indore', type: 'private', lat: 22.7487, lon: 75.9038, beds: 45 },
    { name: 'CHL Hospital Indore', type: 'private', lat: 22.7327, lon: 75.8920, beds: 30 },
    { name: 'Medanta Super Specialty Hospital', type: 'private', lat: 22.7533, lon: 75.8953, beds: 50 },
    { name: 'Apollo Rajshree Hospitals', type: 'private', lat: 22.7095, lon: 75.8569, beds: 25 },
    { name: 'Choithram Hospital', type: 'private', lat: 22.6865, lon: 75.8587, beds: 60 },
    { name: 'MY Hospital (Maharaja Yeshwantrao)', type: 'public', lat: 22.7186, lon: 75.8753, beds: 120 },
    { name: 'Vishesh Jupiter Hospital', type: 'private', lat: 22.7402, lon: 75.8911, beds: 40 },
    { name: 'Sri Aurobindo Institute of Medical Sciences', type: 'private', lat: 22.7758, lon: 75.8427, beds: 80 },
  ];

  for (const h of hospitals) {
    const { error } = await supabase.from('hospitals').insert({
      name: h.name,
      type: h.type,
      location: `POINT(${h.lon} ${h.lat})`,
      available_beds: h.beds,
      icu_beds: Math.floor(h.beds / 3)
    });

    if (error) {
      console.error(`Error inserting ${h.name}:`, error.message);
    } else {
      console.log(`✅ Inserted ${h.name}`);
    }
  }

  console.log('Finished seeding hospitals!');
}

seed();
