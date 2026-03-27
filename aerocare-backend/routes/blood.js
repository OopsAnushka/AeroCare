import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

router.post('/request', async (req, res) => {
  try {
    // Extract data from the request, defaulting to a 10km radius if not provided
    const { latitude, longitude, bloodGroup, radiusKm = 10 } = req.body;

    if (!latitude || !longitude || !bloodGroup) {
      return res.status(400).json({ error: 'Missing required fields: latitude, longitude, or bloodGroup' });
    }

    // Call the PostGIS remote procedure we created in the Supabase SQL Editor
    const { data, error } = await supabase.rpc('find_nearby_donors', {
      user_lat: latitude,
      user_lon: longitude,
      req_blood_group: bloodGroup,
      radius_km: radiusKm
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `No available ${bloodGroup} donors found within ${radiusKm}km.` });
    }

    // Return the list of compatible donors
    res.status(200).json(data);

  } catch (error) {
    console.error('Blood Request Error:', error);
    res.status(500).json({ error: 'Internal server error while finding donors' });
  }
});

export default router;