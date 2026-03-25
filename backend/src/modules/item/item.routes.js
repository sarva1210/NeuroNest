import express from "express";
import { createItem, getItems } from "./item.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createItem);
router.get("/", getItems);

export default router;