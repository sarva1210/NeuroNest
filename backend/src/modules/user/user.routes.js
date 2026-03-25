import express from "express";
import { getProfile } from "./user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);

export default router;