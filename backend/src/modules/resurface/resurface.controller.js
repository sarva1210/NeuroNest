import { asyncHandler } from "../../utils/asyncHandler.js";
import Item from "../item/item.model.js";

export const getResurfacedItems = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // 1. get items older than 3 days
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const items = await Item.find({
    userId,
    createdAt: { $lt: threeDaysAgo }
  }).sort({ createdAt: 1 });

  // 2. pick random 5
  const shuffled = items.sort(() => 0.5 - Math.random());
  const selected = items
  .filter(i => i.tags?.length > 0)
  .sort(() => 0.5 - Math.random())
  .slice(0, 5);

  res.json({
    success: true,
    data: selected
  });
});