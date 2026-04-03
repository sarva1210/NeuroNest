import express from "express";
import { chatAI } from "./chat.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, chatAI);

export default router;