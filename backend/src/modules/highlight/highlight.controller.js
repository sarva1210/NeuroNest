import { asyncHandler } from "../../utils/asyncHandler.js";
import Highlight from "./highlight.model.js";

export const createHighlight = asyncHandler(async (req, res) => {
  const { itemId, text } = req.body;

  const highlight = await Highlight.create({
    itemId,
    text,
    userId: req.user.id
  });

  res.json({ success: true, data: highlight });
});

export const getHighlights = asyncHandler(async (req, res) => {
  const highlights = await Highlight.find({
    userId: req.user.id
  });

  res.json({ success: true, data: highlights });
});