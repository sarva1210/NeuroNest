import { asyncHandler } from "../../utils/asyncHandler.js";
import Collection from "./collection.model.js";

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const collection = await Collection.create({
    name,
    userId: req.user.id
  });

  res.json({ success: true, data: collection });
});

export const addToCollection = asyncHandler(async (req, res) => {
  const { collectionId, itemId } = req.body;

  const collection = await Collection.findById(collectionId);

  collection.items.push(itemId);
  await collection.save();

  res.json({ success: true });
});

// (REMOVE)
export const removeFromCollection = asyncHandler(async (req, res) => {
  const { collectionId, itemId } = req.body;

  const collection = await Collection.findById(collectionId);

  collection.items = collection.items.filter(
    (id) => id.toString() !== itemId
  );

  await collection.save();

  res.json({ success: true });
});

export const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({
    userId: req.user.id
  }).populate("items");

  res.json({ success: true, data: collections });
});