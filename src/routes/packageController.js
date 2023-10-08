require("dotenv").config();
const packageModel = require("../models/packageModel");

const createPackage = async (req, res) => {
  const { name, price, sessionDiscount, medicineDiscount, familyDiscount } =
    req.body;

  const package = new packageModel({
    name,
    price,
    sessionDiscount,
    medicineDiscount,
    familyDiscount,
  });

  try {
    const newPackage = await package.save();
    res.status(201).json(newPackage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePackage = async (req, res) => {
  const { _id } = req.body;

  try {
    // Use findOneAndUpdate to update the package by its _id
    const updatedPackage = await packageModel.findByIdAndUpdate(_id, req.body, {
      new: true,
    });

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }
    return res.status(200).json(updatedPackage);
  } catch (error) {
    console.error("Error updating package:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deletePackage = async (req, res) => {
  const { name } = req.body;
  try {
    await packageModel.findOneAndDelete({ name });
    res.status(201).json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createPackage,
  deletePackage,
  updatePackage,
};
