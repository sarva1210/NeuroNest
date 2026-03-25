import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
  userId: String,
  type: String,
  content: String
}, { timestamps: true });

export default mongoose.model("Insight", insightSchema);