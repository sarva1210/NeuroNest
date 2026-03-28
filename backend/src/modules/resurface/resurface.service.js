import Item from "../item/item.model.js";

export const getResurfacedItems = async (userId) => {
  const now = new Date();

  // Items older than 7 days
  const oldItems = await Item.find({
    userId,
    createdAt: { $lt: new Date(now - 7 * 24 * 60 * 60 * 1000) }
  }).limit(10);

  // Random pick
  const randomItems = await Item.aggregate([
    { $match: { userId } },
    { $sample: { size: 5 } }
  ]);

  // Merge + dedupe
  const map = new Map();

  [...oldItems, ...randomItems].forEach((item) => {
    map.set(item._id.toString(), item);
  });

  return Array.from(map.values()).slice(0, 10);
};