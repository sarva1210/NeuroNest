import Item from "../item/item.model.js";

export const getResurfaceItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Item.find({ userId });

    const scored = items.map((item) => {
      const daysOld =
        (Date.now() - new Date(item.createdAt)) / (1000 * 60 * 60 * 24);

      const daysSinceAccess =
        (Date.now() - new Date(item.lastAccessed)) /
        (1000 * 60 * 60 * 24);

      const importance =
        (item.summary?.length || 0) / 100 +
        (item.content?.length || 0) / 200;

      const score =
        daysOld * 0.6 +
        daysSinceAccess * 0.8 +
        importance;

      return { item, score };
    });

    const sorted = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((s) => s.item);

    res.json({ data: sorted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Resurface failed" });
  }
};