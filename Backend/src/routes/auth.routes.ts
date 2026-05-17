import { Router } from 'express';
import { register, login, getMe } from '../controllers/auth.controller';
import { registerValidation, loginValidation } from '../validations/auth.validation';
import protect from '../middlewares/auth.middleware';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidation, register);

// POST /api/auth/login
router.post('/login', loginValidation, login);

// GET /api/auth/me (protected)
router.get('/me', protect, getMe);

export default router;
