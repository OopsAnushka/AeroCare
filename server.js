// server.js
const express = require('express');
const supabase = require('./supabaseClient');

const app = express();
const port = 3000;

app.get('/health', async (req, res) => {
    try {
        const { data } = await supabase.from('public').select('*');
        console.log(data);
        res.send('Server is running!');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
