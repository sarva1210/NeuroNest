import { asyncHandler } from "../../utils/asyncHandler.js";
import { generateAndStoreInsights, getInsights } from "./insight.service.js";

export const refreshInsights = asyncHandler(async (req, res) => {
  const data = await generateAndStoreInsights(req.user.id);

  res.json({
    success: true,
    data
  });
});

export const fetchInsights = asyncHandler(async (req, res) => {
  const data = await getInsights(req.user.id);

  res.json({
    success: true,
    data
  });
});