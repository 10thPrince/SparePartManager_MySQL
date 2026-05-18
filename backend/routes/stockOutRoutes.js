import express from "express";
import { createStockOut, deleteStockOut, getAllStockOut, getOneStockOut, updateStockOut } from "../controllers/stockOutControllers.js";
import { protect } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post('/create', protect, createStockOut);
router.get('/', protect, getAllStockOut);
router.get('/:id', protect, getOneStockOut);
router.put('/:id', protect, updateStockOut);
router.delete('/:id', protect, deleteStockOut);

export default router;
