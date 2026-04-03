import express from "express";
import { getCollections, createCollection, deleteCollection } from "./collection.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCollections);
router.post("/", authMiddleware, createCollection);
router.delete("/:id", authMiddleware, deleteCollection);

export default router;