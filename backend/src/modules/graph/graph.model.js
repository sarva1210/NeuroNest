import mongoose from "mongoose";

const graphSchema = new mongoose.Schema({
  from: mongoose.Schema.Types.ObjectId,
  to: mongoose.Schema.Types.ObjectId,
  score: Number
});

export default mongoose.model("Graph", graphSchema);