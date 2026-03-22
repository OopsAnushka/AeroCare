import express from 'express';
import sosRouter from './routes/sos.js';
import bloodRouter from './routes/blood.js';
import hospitalRouter from './routes/hospitals.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'AeroCare server is running smoothly!' });
});

app.use('/api/sos', sosRouter);
app.use('/api/blood', bloodRouter); 
app.use('/api/hospitals', hospitalRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});