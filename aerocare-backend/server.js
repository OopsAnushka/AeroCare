import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Ensures your .env file is loaded
import sosRouter from './routes/sos.js';
import bloodRouter from './routes/blood.js';
import hospitalRouter from './routes/hospitals.js';
import samaritanRouter from './routes/samaritans.js';

const app = express();

// 1. FIXED: Port is set to the PORT variable (a number)
const port = process.env.PORT || 5000; 

// 2. FIXED: The FRONTEND_URL is used here for security (CORS)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'AeroCare server is running smoothly!' });
});

app.use('/api/sos', sosRouter);
app.use('/api/blood', bloodRouter); 
app.use('/api/hospitals', hospitalRouter);
app.use('/api/samaritans', samaritanRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});