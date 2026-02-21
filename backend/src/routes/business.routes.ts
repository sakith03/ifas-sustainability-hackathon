import { Router } from 'express';
import { BusinessController } from '../controllers/business.controller';

const router = Router();
const controller = new BusinessController();

router.post('/ideas', controller.createIdea);
router.get('/ideas', controller.getIdeas);
router.post('/ideas/:ideaId/assess', controller.assessIdea);
router.get('/assessments/:assessmentId/download', controller.downloadReport);

export default router;