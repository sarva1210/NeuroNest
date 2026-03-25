import Item from "./item.model.js";

export const createItemService = async (data) => {
  return await Item.create(data);
};

export const getUserItems = async (userId) => {
  return await Item.find({ userId }).sort({ createdAt: -1 });
};