const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("./userController");

// POST: Create a new user
router.post("/registerUser", registerUser);

// POST: Login a user
router.post("/login", loginUser);

// GET: Get all users
router.get("/getUsers", async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});

/*****  TEST ROUTES *****/

// GET: Delete all users (for testing purposes)
router.get("/deleteAllUsers", async (req, res) => {
  try {
    // Delete all records in the RefreshToken collection
    const result = await userModel.deleteMany({});
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "All users deleted successfully" });
    } else {
      res.status(404).json({ message: "No users found to delete" });
    }
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
