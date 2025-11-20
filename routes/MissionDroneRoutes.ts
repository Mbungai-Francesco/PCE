import express from 'express';
import {
  CreateMissionDrone,
  GetAllMissionsDrones,
  GetMissionDroneById,
  UpdateMissionDroneById,
  DeleteMissionDroneById,
} from '../controller/MissionDroneController';

const MissionRoutes = express.Router();

MissionRoutes.post('/mission', CreateMissionDrone);
MissionRoutes.get('/mission', GetAllMissionsDrones);
MissionRoutes.get('/mission/:id', GetMissionDroneById);
MissionRoutes.put('/mission/:id', UpdateMissionDroneById);
MissionRoutes.delete('/mission/:id', DeleteMissionDroneById);

export default MissionRoutes;
