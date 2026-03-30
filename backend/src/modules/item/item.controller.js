import { createItemService, getUserItems } from "./item.service.js";
import { addItemJob } from "../../queues/item.queue.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import Item from "./item.model.js";


export const createItem = asyncHandler(async (req, res) => {
  const { type, content, url, fileUrl } = req.body;

  const item = await createItemService({
    type,
    content,
    url,
    fileUrl,
  });

  await addItemJob(item._id);

  res.json({
    success: true,
    data: item,
  });
});

export const getItems = asyncHandler(async (req, res) => {
  const items = await getUserItems();

  res.json({
    success: true,
    data: items,
  });
});

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

export const getStats = async (req, res, next) => {
  try {
    const stats = {
      notes: await Item.countDocuments({ type: "note" }),
      videos: await Item.countDocuments({ type: "youtube" }),
      tweets: await Item.countDocuments({ type: "tweet" }),
      docs: await Item.countDocuments({ type: "doc" }),
    };

    res.json(stats);
  } catch (err) {
    next(err);
  }
};