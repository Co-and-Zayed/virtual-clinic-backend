const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require("mongoose");

const refreshTokensModel = require("./models/refreshTokensModel");
const userModel = require("./models/userModel");
const appointmentModel = require("./models/appointmentModel");
const doctorRoutes = require("./routes/doctor");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const patientRoutes= require("./routes/patientRoutes")
const packageRoutes = require("./routes/packageRoutes");

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
const { deleteRefreshToken, handleRefreshToken } = require("./routes/authController");
const  prescriptionsRoutes = require("./routes/prescriptionsRoutes");
const { createAppointment, getAppointments, updateAppointment, deleteAppointment} = require("./routes/appointmentController");
const { addFamilyMember, getFamilyMembers } = require("./routes/familyMemberController");


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

/*

Register The Routes Here


/<route-prefix>/<route based on REST convention> 

*/

app.get("/test", getRoute);
app.use("/doctor", doctorRoutes);
app.use("/userAPI", userRoutes);
app.use("/authAPI", authRoutes);
app.use("/patientAPI",patientRoutes)
app.use("/adminAPI", adminRoutes);
app.use("/prescriptionAPI",prescriptionsRoutes);

/*
    the request should include the image field in this format: 
    {
        image: File()
    }
*/

app.post("/upload", upload.single("image"), fileUploadRoute);
