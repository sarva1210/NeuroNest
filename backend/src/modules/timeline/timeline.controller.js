import { asyncHandler } from "../../utils/asyncHandler.js";
import Item from "../item/item.model.js";

export const getTimeline = asyncHandler(async (req, res) => {
  const items = await Item.find({
    userId: req.user.id
  }).sort({ createdAt: -1 });

  const grouped = {};

  items.forEach((item) => {
    const date = new Date(item.createdAt).toDateString();

    if (!grouped[date]) grouped[date] = [];

    grouped[date].push(item);
  });

  res.json({
    success: true,
    data: grouped
  });
});