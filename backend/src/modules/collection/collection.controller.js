import { asyncHandler } from "../../utils/asyncHandler.js";
import Collection from "./collection.model.js";

// GET
export const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({
    userId: req.user.id,
  }).populate("items");

  res.json({
    success: true,
    data: collections,
  });
});

// CREATE
export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;

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

// DELETE
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