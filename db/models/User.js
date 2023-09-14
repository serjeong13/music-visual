import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  image: { type: String, unique: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
