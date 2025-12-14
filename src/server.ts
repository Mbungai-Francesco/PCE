import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';

import cors from 'cors';
import MissionRoutes from '../routes/MissionDroneRoutes';
import AdminRoutes from '../routes/MetaAdminRoutes';
import TechRoutes from '../routes/MetaTechniquesRoutes';
import GeneralesRoutes from '../routes/MetaGeneralesRoutes';
import FinistereRoutes from '../routes/MetaFinistereRoutes';


const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Notes API services...' });
});

app.use(
  '/api',
  MissionRoutes,
  AdminRoutes,
  TechRoutes,
  GeneralesRoutes,
  FinistereRoutes
)

app.get('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'You are OUT OF BOUNDARIES!!!' });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.listen(PORT, () => {
  console.log(
    `Mission drone server running on port ${PORT} : \nlocalhost: http://localhost:${PORT}`,
  );
});