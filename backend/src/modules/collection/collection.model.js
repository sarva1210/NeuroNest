import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item"
    }
  ]
}, { timestamps: true });

export default mongoose.model("Collection", collectionSchema);