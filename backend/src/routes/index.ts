import { Router } from 'express';

import userRoutes from './user';
import aiRoutes from './ai';

const router = Router();

router.use('/users', userRoutes);
router.use('/ai', aiRoutes);

export default router;
