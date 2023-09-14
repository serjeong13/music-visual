import mongoose from "mongoose";

const { Schema } = mongoose;

const reflectionSchema = new Schema({
  email: { type: String, required: true },
  trackId: { type: String, required: true },
  userInput: [{ type: String, required: true }],
  imageUrl: [{ type: String, required: true }],
});

const Reflection =
  mongoose.models.Reflection || mongoose.model("Reflection", reflectionSchema);

export default Reflection;
