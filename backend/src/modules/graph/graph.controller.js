import { asyncHandler } from "../../utils/asyncHandler.js";
import Item from "../item/item.model.js";
import Connection from "./graph.model.js";

export const getGraph = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const items = await Item.find({ userId });
  const connections = await Connection.find({ userId });

  const nodes = items.map(item => ({
    id: item._id.toString(),
    label: item.content
      ? item.content.slice(0, 50)
      : "No content",
    tags: item.tags || []
  }));

  const edges = connections.map(conn => ({
    source: conn.from.toString(),
    target: conn.to.toString(),
    weight: conn.score
  }));

  res.json({
    success: true,
    data: {
      nodes,
      edges
    }
  });
});

export const getRelatedItems = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  const connections = await Connection.find({
    userId,
    $or: [{ from: itemId }, { to: itemId }]
  }).sort({ score: -1 });

  const relatedIds = connections.map(c =>
    c.from.toString() === itemId
      ? c.to
      : c.from
  );

  const items = await Item.find({
    _id: { $in: relatedIds },
    userId
  });

  const result = items.map(item => {
    const conn = connections.find(
      c =>
        c.from.toString() === item._id.toString() ||
        c.to.toString() === item._id.toString()
    );

    return {
      ...item.toObject(),
      score: conn?.score || 0
    };
  });

  res.json({
    success: true,
    count: result.length,
    data: result
  });
});