import { asyncHandler } from "../../utils/asyncHandler.js";
import Item from "../item/item.model.js";
import Connection from "./graph.model.js";

// GET GRAPH
export const getGraph = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const items = await Item.find({ userId });
  const connections = await Connection.find({ userId });

  // NODES
  const nodes = items.map((item) => ({
    id: item._id.toString(),

    name:
      item.title ||
      item.content?.slice(0, 25) ||
      item.url?.slice(0, 30) ||
      "Untitled",

    type: item.type || "text",
    tags: item.tags || [],
    size: 8,
  }));

  // LINKS
  const links = connections
    .filter((conn) => conn.from && conn.to)
    .map((conn) => ({
      source: conn.from.toString(),
      target: conn.to.toString(),
      value: conn.score || 1,
    }));

  // 🔥 IMPORTANT: DIRECT FORMAT
  res.json({
    nodes,
    links,
  });
});


// RELATED ITEMS
export const getRelatedItems = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  const connections = await Connection.find({
    userId,
    $or: [{ from: itemId }, { to: itemId }],
  }).sort({ score: -1 });

  const relatedIds = connections.map((c) =>
    c.from.toString() === itemId ? c.to : c.from
  );

  const items = await Item.find({
    _id: { $in: relatedIds },
    userId,
  });

  const result = items.map((item) => {
    const conn = connections.find(
      (c) =>
        c.from.toString() === item._id.toString() ||
        c.to.toString() === item._id.toString()
    );

    return {
      ...item.toObject(),
      score: conn?.score || 0,
    };
  });

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});