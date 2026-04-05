import express from "express";
import { createItem, getItems, openItem, getStats, deleteItem } from "./item.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("file"), createItem);
router.get("/", authMiddleware, getItems);
router.get("/stats", authMiddleware, getStats);
router.get("/:itemId", authMiddleware, openItem);
router.delete("/:itemId", authMiddleware, deleteItem);

export default router;