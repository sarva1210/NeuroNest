import express from "express";
import { getCollections, createCollection, deleteCollection, addItemToCollection, removeItemFromCollection } from "./collection.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCollections);
router.post("/", authMiddleware, createCollection);

// NEW ROUTES
router.post("/add", authMiddleware, addItemToCollection);
router.post("/remove", authMiddleware, removeItemFromCollection);

router.delete("/:id", authMiddleware, deleteCollection);

export default router;