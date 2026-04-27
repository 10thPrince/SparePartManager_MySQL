import express from "express";
import { createSparePart, deleteSpare, getAllSpares, getOneSpare, updateSpare } from "../controllers/spareControllers.js";
import { protect } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post('/', protect, createSparePart);
router.get('/', protect, getAllSpares);
router.get('/:id', protect, getOneSpare);
router.put('/:id', protect, updateSpare);
router.delete('/:id', protect, deleteSpare);

export default router