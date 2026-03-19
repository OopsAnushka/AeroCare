import express from 'express';
import sosRouter from './routes/sos.js'; // Notice the .js extension here!

const app = express();
const port = 3000;

// Middleware to parse incoming JSON data from the frontend
app.use(express.json());

// A simple health check to confirm the server is awake
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'AeroCare server is running smoothly!' });
});

// Mount the SOS dispatch route
app.use('/api/sos', sosRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});