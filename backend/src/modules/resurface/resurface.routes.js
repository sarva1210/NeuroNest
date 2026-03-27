import express from "express";
import { getResurfacedItems } from "./resurface.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getResurfacedItems);

export default router;