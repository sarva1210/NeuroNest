import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  type: String,
  content: String,
  summary: String,
  embedding: [Number],
  tags: [String],
  status: { type: String, default: "processing" }
}, { timestamps: true });

export default mongoose.model("Item", itemSchema);