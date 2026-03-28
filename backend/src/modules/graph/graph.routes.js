import express from "express";
import { getGraph, getRelatedItems } from "./graph.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getGraph);
router.get("/related/:itemId", authMiddleware, getRelatedItems);

export default router;