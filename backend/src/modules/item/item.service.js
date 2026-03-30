import Item from "./item.model.js";

export const createItemService = async (data) => {
  return await Item.create(data);
};

export const getUserItems = async () => {
  return await Item.find().sort({ createdAt: -1 });
};