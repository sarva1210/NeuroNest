import express from "express";
import { chatWithMemory } from "./chat.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, chatWithMemory);

export default router;