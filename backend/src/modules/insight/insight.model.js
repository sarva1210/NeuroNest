import mongoose from "mongoose";

const insightSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    content: String
  },
  { timestamps: true }
);

export default mongoose.model("Insight", insightSchema);