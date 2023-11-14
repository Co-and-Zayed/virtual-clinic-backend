const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgetPassword,
  verifyOtp,
  getUser,
} = require("./userController");
const userModel = require("../../models/userModel");
const { uploadS3 } = require("../../utils/uploadMultipleFiles");
const { authenticateToken } = require("../auth/authController");

// POST: Create a new user
router.post("/registerUser", uploadS3.array("files", 20), registerUser);

// GET: Get a user by username
router.get("/getUser", authenticateToken(), getUser);

// POST: Login a user
router.post("/login", loginUser);

// POST: Forget password
router.post("/forgetPassword", forgetPassword);

// POST: Verify Otp
router.post("/verifyOtp", verifyOtp);

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

module.exports = router;
