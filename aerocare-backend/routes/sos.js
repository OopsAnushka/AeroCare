import express from 'express';
import supabase from '../supabaseClient.js'; // Notice the .js extension!

const router = express.Router();

router.post('/dispatch', async (req, res) => {
  try {
    const { latitude, longitude, emergencyType } = req.body;

    if (!latitude || !longitude || !emergencyType) {
      return res.status(400).json({ error: 'Missing required fields: latitude, longitude, or emergencyType' });
    }

    // Call the PostGIS remote procedure we created in the Supabase SQL Editor
    const { data, error } = await supabase.rpc('find_nearest_ambulance', {
      user_lat: latitude,
      user_lon: longitude,
      req_type: emergencyType
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `No available ${emergencyType} ambulances found nearby.` });
    }

    // Return the single nearest ambulance
    res.status(200).json(data[0]);

  } catch (error) {
    console.error('Dispatch Error:', error);
    res.status(500).json({ error: 'Internal server error while finding ambulance' });
  }
});

export default router;