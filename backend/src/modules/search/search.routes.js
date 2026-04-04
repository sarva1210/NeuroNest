import express from "express";
import { semanticSearch, askAI, chatWithMemory } from "./search.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, semanticSearch);
router.post("/ask", authMiddleware, askAI);
router.post("/chat",authMiddleware, chatWithMemory);

export default router;