import { Router } from 'express';
import register from '../handlers/registerHandler.js';
import login from '../handlers/loginHandler.js';
import getUsers from '../handlers/usersHandler.js';
import logout from '../handlers/logoutHandler.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getUsers);
router.post('/logout', logout);

export default router;
