import Insight from "./insight.model.js";

export const createInsight = async (data) => {
  return await Insight.create(data);
};

export const getInsights = async (userId) => {
  return await Insight.find({ userId });
};