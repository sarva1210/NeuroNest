import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import { env } from "../../config/env.js";

export const registerUser = async ({ email, password }) => {
  const hash = await bcrypt.hash(password, 10);
  return await User.create({ email, password: hash });
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, env.JWT_SECRET);

  return { user, token };
};