import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item"
  },
  score: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

export default mongoose.model("Connection", connectionSchema);