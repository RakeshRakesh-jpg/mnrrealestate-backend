import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  verified: { type: Boolean, default: false },
});

// ✅ Correct ESM export
const User = mongoose.model("User", userSchema);
export default User;
