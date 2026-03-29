import express from "express";
import { refreshInsights, fetchInsights } from "./insight.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/refresh", authMiddleware, refreshInsights);
router.get("/", authMiddleware, fetchInsights);

export default router;