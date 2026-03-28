import { asyncHandler } from "../../utils/asyncHandler.js";
import { chatWithMemoryService } from "./chat.service.js";

export const chatWithMemory = asyncHandler(async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Query is required"
    });
  }

  const result = await chatWithMemoryService(query, req.user.id);

  res.json({
    success: true,
    data: result
  });
});