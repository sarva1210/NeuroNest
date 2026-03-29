import express from "express";
import { getTimeline } from "./timeline.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTimeline);

export default router;