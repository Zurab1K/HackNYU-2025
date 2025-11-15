import { Router } from 'express';

const router = Router();

// GET /users
router.get('/', (req, res) => {
    res.json([{ id: 1, name: 'John' }]);
});

export default router;
