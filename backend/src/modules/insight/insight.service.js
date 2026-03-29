import Item from "../item/item.model.js";
import Insight from "./insight.model.js";

export const generateAndStoreInsights = async (userId) => {
  const items = await Item.find({
    userId,
    status: "ready"
  });

  if (!items.length) return [];

  const tagCount = {};
  const typeCount = {};

  items.forEach((item) => {
    (item.tags || []).forEach((tag) => {
      tagCount[tag] = (tagCount[tag] || 0) + 1;
    });

    if (item.type) {
      typeCount[item.type] = (typeCount[item.type] || 0) + 1;
    }
  });

  const topTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);

  const insights = [];

  if (topTags.length) {
    insights.push(`You frequently save content about ${topTags.join(", ")}`);
  }

  await Insight.deleteMany({ userId });

  const saved = [];

  for (const text of insights) {
    const doc = await Insight.create({
      userId,
      content: text
    });
    saved.push(doc);
  }

  return saved;
};

export const getInsights = async (userId) => {
  return await Insight.find({ userId }).sort({ createdAt: -1 });
};