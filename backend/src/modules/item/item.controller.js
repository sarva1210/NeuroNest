import { createItemService, getUserItems } from "./item.service.js";
import { addItemJob } from "../../queues/item.queue.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const createItem = asyncHandler(async (req, res) => {
  const { type, content, url, fileUrl } = req.body;

  const item = await createItemService({
    type,
    content,
    url,
    fileUrl,
    userId: req.user.id
  });

  await addItemJob(item._id);
  console.log("Job added:", item._id);

  res.json({
    success: true,
    data: item
  });
});

export const getItems = asyncHandler(async (req, res) => {
  const items = await getUserItems(req.user.id);

  res.json({
    success: true,
    data: items
  });
});