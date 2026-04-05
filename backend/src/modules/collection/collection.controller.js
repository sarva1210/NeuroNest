import { asyncHandler } from "../../utils/asyncHandler.js";
import Collection from "./collection.model.js";

// GET COLLECTIONS
export const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({
    userId: req.user.id,
  }).populate("items");

  res.json({
    success: true,
    data: collections,
  });
});

// CREATE COLLECTION
export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  const exists = await Collection.findOne({
    name,
    userId: req.user.id,
  });

  if (exists) {
    return res.status(400).json({
      message: "Collection already exists",
    });
  }

  const collection = await Collection.create({
    name,
    userId: req.user.id,
  });

  res.json({
    success: true,
    data: collection,
  });
});

// ADD ITEM TO COLLECTION 🔥
export const addItemToCollection = asyncHandler(async (req, res) => {
  const { collectionId, itemId } = req.body;

  if (!collectionId || !itemId) {
    return res.status(400).json({
      message: "collectionId and itemId required",
    });
  }

  const collection = await Collection.findOne({
    _id: collectionId,
    userId: req.user.id,
  });

  if (!collection) {
    return res.status(404).json({
      message: "Collection not found",
    });
  }

  // prevent duplicate
  if (!collection.items.includes(itemId)) {
    collection.items.push(itemId);
    await collection.save();
  }

  res.json({
    success: true,
    message: "Item added to collection",
    data: collection,
  });
});

// REMOVE ITEM FROM COLLECTION 
export const removeItemFromCollection = asyncHandler(async (req, res) => {
  const { collectionId, itemId } = req.body;

  const collection = await Collection.findOne({
    _id: collectionId,
    userId: req.user.id,
  });

  if (!collection) {
    return res.status(404).json({
      message: "Collection not found",
    });
  }

  collection.items = collection.items.filter(
    (id) => id.toString() !== itemId
  );

  await collection.save();

  res.json({
    success: true,
    message: "Item removed",
    data: collection,
  });
});

// DELETE COLLECTION
export const deleteCollection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Collection.findOneAndDelete({
    _id: id,
    userId: req.user.id,
  });

  res.json({
    success: true,
    message: "Deleted",
  });
});