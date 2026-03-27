import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  type: {
    type: String,
    enum: ["text", "link", "youtube", "image", "pdf"]
  },

  content: String,
  url: String,
  fileUrl: String,

  embedding: [Number],
  tags: [String],
  summary: String,

  enrichment: [],

  status: {
    type: String,
    default: "processing"
  }

}, { timestamps: true });

export default mongoose.model("Item", itemSchema);