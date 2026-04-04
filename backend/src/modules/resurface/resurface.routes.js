import express from "express";
import { getResurfaceItems  } from "./resurface.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getResurfaceItems );

export default router;