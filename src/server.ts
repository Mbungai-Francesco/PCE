import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';

import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Notes API services...' });
});

app.get('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'You are OUT OF BOUNDARIES!!!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `server running on port ${PORT} : \nlocalhost: http://localhost:${PORT}`,
  );
});