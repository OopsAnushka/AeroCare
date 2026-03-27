import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

router.post('/nearest', async (req, res) => {
  try {
    const { latitude, longitude, resourceType = 'any' } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Missing required fields: latitude or longitude' });
    }

    // Call the PostGIS remote procedure
    const { data, error } = await supabase.rpc('find_nearest_hospital', {
      user_lat: latitude,
      user_lon: longitude,
      req_resource: resourceType
    });

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ message: `No nearby hospitals found with available ${resourceType}.` });
    }

    // Return the single nearest equipped hospital
    res.status(200).json(data[0]);

  } catch (error) {
    console.error('Hospital Routing Error:', error);
    res.status(500).json({ error: 'Internal server error while finding hospitals' });
  }
});

export default router;