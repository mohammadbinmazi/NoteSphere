const { findUserByEmail, createUser } = require("../models/userModel");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await hashPassword(password);
    const newUser = await createUser(username, email, hashed);
    const token = generateToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
  } catch (error) {
    console.error("Error while registering the user:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "please enter all fields" });
  }
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "wrong password" });
    }
    const token = generateToken(user);

    res.status(200).json({
      message: "user login succesfully",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("login error", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  registerUser,
  loginUser,
};
