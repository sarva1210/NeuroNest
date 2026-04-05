import { createItemService } from "./item.service.js";
import { addItemJob } from "../../queues/item.queue.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Item from "./item.model.js";

// CREATE ITEM
export const createItem = asyncHandler(async (req, res) => {
  const { type, content, url, title } = req.body;

  let fileUrl = null;

  if (req.file) {
    fileUrl = `http://localhost:3000/uploads/${req.file.filename}`; // ← this line only
  }

  const item = await createItemService({
    type,
    title: title || req.file?.originalname || "",
    content,
    url,
    fileUrl,
    userId: req.user.id,
    status: "processing",
  });

  await addItemJob(item._id);

  res.json({
    success: true,
    message: "Saved & processing",
    data: item,
  });
});

// GET ALL ITEMS (USER)
export const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ userId: req.user.id })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: items,
  });
});

// OPEN ITEM (TRACK USAGE)
export const openItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const item = await Item.findByIdAndUpdate(
    itemId,
    { lastAccessed: new Date() },
    { new: true }
  );

  res.json({
    success: true,
    data: item,
  });
});

// STATS
export const getStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = {
    notes: await Item.countDocuments({ userId, type: "text" }),
    videos: await Item.countDocuments({ userId, type: "youtube" }),
    tweets: await Item.countDocuments({ userId, type: "tweet" }),
    docs: await Item.countDocuments({ userId, type: "pdf" }),
  };

  res.json(stats);
});

export const deleteItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  await Item.findOneAndDelete({ _id: itemId, userId: req.user.id });
  res.json({ success: true, message: "Deleted" });
});