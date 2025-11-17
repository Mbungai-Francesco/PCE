import { Router } from 'express';
import {
  CreateMetaAdmin,
  GetAllMetaAdmin,
  GetMetaAdminById,
  UpdateMetaAdminById,
  DeleteMetaAdminById,
} from '../controller/MetaAdminController';

const AdminRoutes = Router();

AdminRoutes.post('/metadmin', CreateMetaAdmin);
AdminRoutes.get('/metadmin', GetAllMetaAdmin);
AdminRoutes.get('/metadmin/:id', GetMetaAdminById);
AdminRoutes.put('/metadmin/:id', UpdateMetaAdminById);
AdminRoutes.delete('/metadmin/:id', DeleteMetaAdminById);

export default AdminRoutes;
