import express from "express";
import { getMe, login, logout, register } from "../controllers/authControllers.js";
import { protect } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout)
router.get('/me', protect, getMe)

export default router