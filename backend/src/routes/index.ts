import { Router } from 'express';
import businessRoutes from './business.routes';

const router = Router();

router.use('/business', businessRoutes);

export { router as default };  