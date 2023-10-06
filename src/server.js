const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");
const refreshTokensModel = require("./models/refreshTokensModel");
const userModel = require("./models/userModel");

// Middleware
app.use(express.json());
app.use(cors());

// Mongoose Setup
mongoose.set("strictQuery", false);

// Port Number
const port = process.env.PORT || 3000;

// Util Imports
const { upload } = require("./utils/uploadFile");

// Route Imports
const { getRoute, fileUploadRoute } = require("./routes/test");
const { registerUser, loginUser } = require("./routes/userController");
const { deleteRefreshToken, handleRefreshToken } = require("./routes/auth");
const  prescriptionsRoutes = require("./routes/prescriptions");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database Setup Correctly");
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch((err) => {
    console.log(`Error occured: ${err}`);
  });

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

/*

Register The Routes Here

/<route-prefix>/<route based on REST convention> 

*/

app.get("/test", getRoute);
// expects a JSON body with name, email, and type fields
app.post("/registerUser", registerUser);
app.post("/login", loginUser);
app.get("/getUsers", async (req, res) => {
  const users = await userModel.find();
  res.json(users);
});

app.get("/deleteAllUsers", async (req, res) => {
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

app.get("/testingToken", authenticateToken, (req, res) => {
  res.json({ message: "Token is valid" });
});

// Auth Routes
app.delete("/logout", deleteRefreshToken);
// expects a JSON body with token field
app.post("/regenerateToken", handleRefreshToken);
app.get("/allRefreshTokens", async (req, res) => {
  const tokens = await refreshTokensModel.find();
  res.json(tokens);
});

app.use("/prescriptions",prescriptionsRoutes);

/*
    the request should include the image field in this format: 
    {
        image: File()
    }
*/

app.post("/upload", upload.single("image"), fileUploadRoute);
