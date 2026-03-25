import Graph from "./graph.model.js";

export const createConnection = async (from, to, score) => {
  return await Graph.create({ from, to, score });
};