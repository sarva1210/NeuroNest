import express from "express";
import { semanticSearch } from "./search.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/search
 * @desc Semantic search
 * @access Private
 */
router.post("/", authMiddleware, semanticSearch);

export default router;