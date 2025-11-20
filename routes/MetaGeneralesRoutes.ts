import express from 'express';
import {
  CreateMetaGenerales,
  GetAllMetaGenerales,
  GetMetaGeneralesById,
  UpdateMetaGeneralesById,
  DeleteMetaGeneralesById,
} from '../controller/MetaGeneralesController';

const GeneralesRoutes = express.Router();

GeneralesRoutes.post('/metagenerales', CreateMetaGenerales);
GeneralesRoutes.get('/metagenerales', GetAllMetaGenerales);
GeneralesRoutes.get('/metagenerales/:id', GetMetaGeneralesById);
GeneralesRoutes.put('/metagenerales/:id', UpdateMetaGeneralesById);
GeneralesRoutes.delete('/metagenerales/:id', DeleteMetaGeneralesById);

export default GeneralesRoutes;
