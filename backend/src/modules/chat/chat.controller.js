import { asyncHandler } from "../../utils/asyncHandler.js";
import { chatWithMemory } from "../../services/chat/chat.service.js";

export const chat = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query required" });
  }

  const answer = await chatWithMemory(query, req.user.id);

  res.json({
    success: true,
    answer
  });
});