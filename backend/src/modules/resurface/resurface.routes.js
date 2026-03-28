import express from "express";
import { getResurface } from "./resurface.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getResurface);

export default router;