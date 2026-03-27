import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

router.post('/nearby', async (req, res) => {
  try {
    // Default to a 2km radius if the frontend doesn't specify one
    const { latitude, longitude, radiusKm = 2 } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields: latitude or longitude' });
    }

    // Call the PostGIS remote procedure
    const { data, error } = await supabase.rpc('find_nearby_samaritans', {
      user_lat: latitude,
      user_lon: longitude,
      radius_km: radiusKm
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `No available Good Samaritans found within ${radiusKm}km.` });
    }

    // Return the list of nearby volunteers
    res.status(200).json(data);

  } catch (error) {
    console.error('Samaritan Search Error:', error);
    res.status(500).json({ error: 'Internal server error while searching for volunteers' });
  }
});

export default router;