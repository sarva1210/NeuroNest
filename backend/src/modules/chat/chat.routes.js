import express from "express";
import { chat } from "./chat.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, chat);

export default router;