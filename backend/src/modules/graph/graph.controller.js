import { asyncHandler } from "../../utils/asyncHandler.js";
import Item from "../item/item.model.js";
import Connection from "./graph.model.js";

export const getGraph = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // 1. get all user items
  const items = await Item.find({ userId });

  // 2. get all connections
  const connections = await Connection.find({
    userId
  });

  // 3. format nodes
  const nodes = items.map(item => ({
    id: item._id,
    label: item.content ? item.content.slice(0, 50) : "No content",
    tags: item.tags || []
  }));

  // 4. format edges
  const edges = connections.map(conn => ({
    source: conn.from,
    target: conn.to,
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