import Connection from "./graph.model.js";

export const createConnection = async (from, to, score, userId) => {
  if (!userId) return;

  return await Connection.create({
    from,
    to,
    score,
    userId
  });
};