import { Router } from 'express';
import { registerHandler, loginHandler, refreshHandler, logoutHandler } from './auth.controller';
import { validateRegister, validateLogin } from './auth.validator';

const router = Router();

router.post('/register', validateRegister, registerHandler);
router.post('/login', validateLogin, loginHandler);
router.post('/refresh', refreshHandler);
router.post('/logout', logoutHandler);

export default router;
