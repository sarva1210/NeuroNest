import express from "express";
import multer from "multer";
import { createItem, getItems, openItem, getStats } from "./item.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// CREATE
router.post("/", authMiddleware, upload.single("file"), createItem);

// GET USER ITEMS
router.get("/", authMiddleware, getItems);

// OPEN ITEM
router.get("/:itemId", authMiddleware, openItem);

// STATS
router.get("/stats", authMiddleware, getStats);

export default router;