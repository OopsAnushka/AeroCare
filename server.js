// server.js
const express = require('express');
const supabase = require('./supabaseClient');
const routes = require('./routes');

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api/sos', routes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
