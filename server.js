const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "../.env",
});
const mongoose = require("mongoose");

const clinicRoutes = require("./clinic_backend/src/clinic");
// const pharmacyRoutes = require("./routes/patient/patient");

// Middleware
app.use(express.json());
app.use(cors());

// Mongoose Setup
mongoose.set("strictQuery", false);

// Port Number
const port = process.env.PORT || 3000;

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

app.use("/clinic", clinicRoutes);
// app.use("/patient", patientRoutes);
