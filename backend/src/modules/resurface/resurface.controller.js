import { asyncHandler } from "../../utils/asyncHandler.js";
import { getResurfacedItems } from "./resurface.service.js";

export const getResurface = asyncHandler(async (req, res) => {
  const items = await getResurfacedItems(req.user.id);

  res.json({
    success: true,
    count: items.length,
    data: items
  });
});