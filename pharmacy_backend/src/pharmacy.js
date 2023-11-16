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
const commonRoutes = require("./routes/commonRoutes");
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
const { uploadS3 } = require("./utils/uploadMultipleFiles");

// Route Imports
const { getRoute, fileUploadRoute } = require("./routes/test");
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

app.use(commonRoutes);

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

// Upload Multiple Files Test Route
app.post("/uploadMultiple", uploadS3.array('files', 2), (req, res) => {
  const files = req.files;
  for (let i = 0; i < files.length; i++) {
    console.log(Date.now().toString() + "-" + files[i].originalname + "\n");
  }
  res.json({message: "Files Uploaded Successfully"});
})
