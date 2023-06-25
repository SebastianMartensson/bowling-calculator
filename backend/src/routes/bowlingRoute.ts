import { Router } from 'express';
import * as bowlingController from '../controller/bowlingController';
import { validateRequest } from '../middlewares';
import { multidimentionalNumberArraySchema } from '../interface/Validations';

const router = Router();

router.post('/calculate', validateRequest(multidimentionalNumberArraySchema ), bowlingController.calculateScore);

export default router;