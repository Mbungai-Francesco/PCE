import express from 'express';
import {
  CreateMissionFinistere,
  GetAllMissionsFinistere,
  GetMissionFinistereById,
  UpdateMissionFinistereByIdMission,
  DeleteMissionFinistereById,
  GetMissionFinistereByIdMission
} from '../controller/MetaFinistereController';

const FinistereRoutes = express.Router();

FinistereRoutes.post('/metafinistere/:idMission', CreateMissionFinistere);
FinistereRoutes.get('/metafinistere', GetAllMissionsFinistere);
FinistereRoutes.get('/metafinistere/:id', GetMissionFinistereById);
FinistereRoutes.get('/metafinistere/idMission/:idMission', GetMissionFinistereByIdMission);
FinistereRoutes.put('/metafinistere/:idMission', UpdateMissionFinistereByIdMission);
FinistereRoutes.delete('/metafinistere/:id', DeleteMissionFinistereById);

export default FinistereRoutes;
