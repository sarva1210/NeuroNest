import express from "express";
import {
  createCollection,
  addToCollection,
  getCollections
} from "./collection.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCollection);
router.post("/add", authMiddleware, addToCollection);
router.get("/", authMiddleware, getCollections);

export default router;