import { Router } from 'express';
import barCodeRoutes from './barcode.routes';

const routes = Router();

routes.use(barCodeRoutes);

export default routes;