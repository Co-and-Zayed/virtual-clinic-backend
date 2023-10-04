// #Task route solution
const userModel = require("../models/userModel");
const { default: mongoose } = require("mongoose");
const { createUserTokens } = require("./auth");

const loginUser = async (req, res) => {
  const { token } = req.body;
  const user = await getUser(token);
  if (user) {
    res.status(200).json({
      user: user,
      tokens: await createUserTokens({ email: email, issuedAt: new Date() }),
    });
  } else {
    res.status(400).json({ message: "User not found" });
  }
};

const getUser = async (token) => {
  try {
    // Find a user by the provided email
    const user = await userModel.findOne({ token });
    if (user) {
      return user;
    }
    return null;
  } catch (error) {
    res.json({ message: "Error finding the user" });
  }
};

const registerUser = async (req, res) => {
  const { name, email, type } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Please provide all required fields",
    });
  }

  const user = new userModel({
    name: name,
    email: email,
    type: type,
  });

  try {
    const newUser = await user.save();
    res.status(201).json({
      user: newUser,
      tokens: await createUserTokens({ email: email, issuedAt: new Date() }),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser };
