import Connection from "./graph.model.js";

export const createConnection = async (from, to, score, userId) => {
  if (!userId) return;

  // prevent self-link
  if (from.toString() === to.toString()) return;

  // prevent duplicates
  const exists = await Connection.findOne({
    from,
    to,
    userId
  });

  if (exists) return exists;

  return await Connection.create({
    from,
    to,
    score,
    userId
  });
};