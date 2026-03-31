import express from "express";
import { semanticSearch, askAI, chatAI } from "./search.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", semanticSearch);
router.get("/ask", askAI);
router.post("/chat", chatAI);

export default router;