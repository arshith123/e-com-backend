import express from 'express';
import { createUser, validateUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/save',createUser);
router.post('/validate',validateUser)

export default router;