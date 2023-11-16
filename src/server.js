const express = require("express");
const router = express.Router();

const doctorRoutes = require("./routes/doctor/doctor");
const patientRoutes = require("./routes/patient/patient");
const userRoutes = require("./routes/user/userRoutes");
const authRoutes = require("./routes/auth/authRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");
const commonRoutes = require("./routes/commonRoutes");
const dropdownRoutes = require("./routes/dropdown/dropdown");
const stripeRoutes = require("./routes/stripe/stripeRoutes");

router.get("/test", getRoute);
router.use("/doctor", doctorRoutes);
router.use("/patient", patientRoutes);
router.use("/userAPI", userRoutes);
router.use("/authAPI", authRoutes);
router.use("/stripe", stripeRoutes);

router.use(commonRoutes);

router.use("/adminAPI", adminRoutes);
router.use("/prescriptionAPI", prescriptionsRoutes);
router.use("/dropdown", dropdownRoutes);
router.post("/upload", upload.single("image"), fileUploadRoute);

// Upload Multiple Files Test Route
router.post("/uploadMultiple", uploadS3.array("files", 2), (req, res) => {
  const files = req.files;
  for (let i = 0; i < files.length; i++) {
    console.log(Date.now().toString() + "-" + files[i].originalname + "\n");
  }
  res.json({ message: "Files Uploaded Successfully" });
});

module.exports = router;
