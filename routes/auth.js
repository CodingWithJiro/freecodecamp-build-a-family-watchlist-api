import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findByUsername } from "../utils/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const isMissingUsernameOrPassword = !username || !password;
  if (isMissingUsernameOrPassword) {
    return res.status(400).json({
      error: "Missing username or password.",
    });
  }

  const user = findByUsername(username);
  const isUsernameNotFound = !user;

  if (isUsernameNotFound) {
    return res.status(401).json({
      error: "Username does not exist.",
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      error: "Invalid password.",
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  return res.status(200).json({ token });
});

export default router;
