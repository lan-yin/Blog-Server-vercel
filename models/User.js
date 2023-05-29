import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.methods.matchPasswords = async function (enterPassword) {
  return await bcrypt.compare(enterPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
