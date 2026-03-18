// routes/sos.js
const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.post('/dispatch', async (req, res) => {
    const { latitude, longitude, emergencyType } = req.body;

    if (!latitude || !longitude || !emergencyType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const ambulanceQuery = supabase
            .from('ambulances')
            .select('*')
            .eq('status', 'available')
            .order('distance', { ascending: true });

        const { data } = await ambulanceQuery;

        if (!data.length) {
            return res.status(404).json({ error: 'No available ambulances' });
        }

        const nearestAmbulance = data[0];
        const ambulanceDetails = {
            id: nearestAmbulance.id,
            name: nearestAmbulance.name,
            location: { latitude: nearestAmbulance.location.latitude, longitude: nearestAmbulance.location.longitude },
            emergencyType: nearestAmbulance.emergencyType
        };

        return res.json(ambulanceDetails);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
