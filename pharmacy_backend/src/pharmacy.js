const express = require("express");
const router = express.Router();

const pharmacistRoutes = require("./routes/pharmacist/pharmacist");
const patientRoutes = require("./routes/patient/patient");
const userRoutes = require("./routes/user/userRoutes");
const authRoutes = require("../../routes/auth/authRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");
const dropdownRoutes = require("./routes/dropdown/dropdown");
const medicineRoutes = require("./routes/medicine/medicineRoutes");
const cartRoutes = require("./routes/medicine/cartRoutes");
const salesRoutes = require("./routes/sales/salesRoutes");
const orderRoutes = require("./routes/order/orderRoutes");
const stripeRoutes = require("./routes/stripe/stripeRoutes");
const { getRoute, fileUploadRoute } = require("./routes/test");

router.get("/test", getRoute);
router.use("/pharmacist", pharmacistRoutes);
router.use("/patient", patientRoutes);
router.use("/patient", cartRoutes);
router.use("/userAPI", userRoutes);
router.use("/authAPI", authRoutes);
router.use("/admin", adminRoutes);
router.use("/dropdown", dropdownRoutes);
router.use(medicineRoutes);
router.use(salesRoutes);
router.use("/orderAPI", orderRoutes);
router.use("/stripe", stripeRoutes);

module.exports = router;
