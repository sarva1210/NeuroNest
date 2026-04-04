import express from "express";
import { semanticSearch, askAI, chatAI } from "./search.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, semanticSearch);
router.post("/ask", authMiddleware, askAI);
router.post("/chat", authMiddleware, chatAI);

export default router;