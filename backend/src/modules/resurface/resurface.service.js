import mongoose from "mongoose";
import Item from "../item/item.model.js";

export const getResurfacedItems = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();

  const items = await Item.find({
    userId: userObjectId,
    status: "ready"
  });

  const scored = items.map((item) => {
    const daysOld =
      (now - new Date(item.createdAt)) / (1000 * 60 * 60 * 24);

    const lastSeenGap =
      (now - new Date(item.lastAccessed || item.createdAt)) /
      (1000 * 60 * 60 * 24);

    const importance =
      (item.tags?.length || 0) + (item.summary ? 1 : 0);

    const score =
      daysOld * 0.3 +
      lastSeenGap * 0.5 +
      importance * 0.2 +
      Math.random() * 2;

    return {
      item,
      score
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((x) => x.item);
};