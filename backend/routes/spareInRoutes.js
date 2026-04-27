import express from "express";
import { createSpareIn, deleteSpareIn, getAllSpareIn, getOneSpareIn, updateSpareIn } from "../controllers/spareInControllers.js";
import { protect } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post('/create', protect, createSpareIn);
router.get('/', protect, getAllSpareIn);
router.get('/:id', protect, getOneSpareIn);
router.put('/:id', protect, updateSpareIn);
router.delete('/:id', protect, deleteSpareIn);

export default router;