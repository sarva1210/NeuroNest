import Item from "../item/item.model.js";

export const semanticSearchService = async (query, userId) => {
  const q = query.toLowerCase();

  const items = await Item.find({
    userId,
    $or: [
      { content: { $regex: q, $options: "i" } },
      { summary: { $regex: q, $options: "i" } },
      { tags: { $in: [q] } }
    ]
  });

  const scored = items.map((item) => {
    let score = 0;

    if (item.content?.toLowerCase().includes(q)) score += 2;
    if (item.summary?.toLowerCase().includes(q)) score += 1;
    if (item.tags?.includes(q)) score += 3;

    return {
      ...item.toObject(),
      score
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored;
};