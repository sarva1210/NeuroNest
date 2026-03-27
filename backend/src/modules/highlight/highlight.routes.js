import express from "express";
import {
  createHighlight,
  getHighlights
} from "./highlight.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createHighlight);
router.get("/", authMiddleware, getHighlights);

export default router;