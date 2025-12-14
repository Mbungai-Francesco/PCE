import express from 'express';
import {
  CreateMissionFinistere,
  GetAllMissionsFinistere,
  GetMissionFinistereById,
  UpdateMissionFinistereById,
  DeleteMissionFinistereById,
} from '../controller/MetaFinistereController';

const FinistereRoutes = express.Router();

FinistereRoutes.post('/metafinistere/:idMission', CreateMissionFinistere);
FinistereRoutes.get('/metafinistere', GetAllMissionsFinistere);
FinistereRoutes.get('/metafinistere/:id', GetMissionFinistereById);
FinistereRoutes.put('/metafinistere/:id', UpdateMissionFinistereById);
FinistereRoutes.delete('/metafinistere/:id', DeleteMissionFinistereById);

export default FinistereRoutes;
