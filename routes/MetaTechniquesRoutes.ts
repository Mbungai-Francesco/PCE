import { Router } from 'express';
import {
  CreateMetaTechniques,
  GetAllMetaTechniques,
  GetMetaTechniquesById,
  UpdateMetaTechniquesById,
  DeleteMetaTechniquesById,
} from '../controller/MetaTechniquesController';

const TechRoutes = Router();

TechRoutes.post('/metatechniques', CreateMetaTechniques);
TechRoutes.get('/metatechniques', GetAllMetaTechniques);
TechRoutes.get('/metatechniques/:id', GetMetaTechniquesById);
TechRoutes.put('/metatechniques/:id', UpdateMetaTechniquesById);
TechRoutes.delete('/metatechniques/:id', DeleteMetaTechniquesById);

export default TechRoutes;
