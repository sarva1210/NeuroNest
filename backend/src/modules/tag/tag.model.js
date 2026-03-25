import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  name: String,
  userId: mongoose.Schema.Types.ObjectId
});

tagSchema.index({ name: 1, userId: 1 }, { unique: true });

export default mongoose.model("Tag", tagSchema);