const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "../.env",
});
const mongoose = require("mongoose");

const doctorRoutes = require("./routes/doctor/doctor");
const patientRoutes = require("./routes/patient/patient");
const userRoutes = require("./routes/user/userRoutes");
const authRoutes = require("./routes/auth/authRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");
const packageRoutes = require("./routes/package/packageRoutes");
const dropdownRoutes = require("./routes/dropdown/dropdown");
const stripeRoutes = require("./routes/stripe/stripeRoutes");

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
const { registerUser, loginUser } = require("./routes/user/userController");
const {
  deleteRefreshToken,
  handleRefreshToken,
} = require("./routes/auth/authController");
const prescriptionsRoutes = require("./routes/prescriptions/prescriptionsRoutes");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to the database!");
    app.listen(port, () => {});
  })
  .catch((err) => {});

/*

Register The Routes Here


/<route-prefix>/<route based on REST convention> 

*/

app.get("/test", getRoute);
app.use("/doctor", doctorRoutes);
app.use("/patient", patientRoutes);
app.use("/userAPI", userRoutes);
app.use("/authAPI", authRoutes);
app.use("/stripe", stripeRoutes);


app.use("/adminAPI", adminRoutes);
app.use("/prescriptionAPI", prescriptionsRoutes);
app.use("/dropdown", dropdownRoutes);

/*
    the request should include the image field in this format: 
    {
        image: File()
    }
*/

app.post("/upload", upload.single("image"), fileUploadRoute);
