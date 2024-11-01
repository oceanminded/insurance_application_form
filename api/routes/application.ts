import { Router } from 'express';
import { initializeRoutes } from '../insurance/InsuranceApplication.routes';

const routes = Router();

initializeRoutes(routes);

export default routes;
