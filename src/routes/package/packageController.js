require("dotenv").config();
const packageModel = require("../../models/packageModel");

const getPackages = async (req, res) => {
  try {
    const packages = await packageModel.find().lean();
    // Map over the packages to add the "tier" key based on the "price" field
    const packagesWithTier = packages.map((package) => {
      const price = package.price;
      if (price >= 3600 && price < 6000) {
        package.tier = "Silver";
      } else if (price >= 6000 && price < 9000) {
        package.tier = "Gold";
      } else if (price >= 9000) {
        package.tier = "Platinum";
      } else {
        package.tier = "Bronze";
      }
      return package;
    });
    console.log("PACKAGES WITH TIER", packagesWithTier);
    res.status(200).json(packagesWithTier);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
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
    res.json({ message: err.message, status: 400 });
  }
};

const updatePackage = async (req, res) => {
  const { id } = req.params;
  console.log("PACKAGE ID:", id);
  try {
    // Use findOneAndUpdate to update the package by its _id
    const updatedPackage = await packageModel.findByIdAndUpdate(
      id,
      { _id: id, ...req.body },
      { new: true }
    );

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
  const { id } = req.params;
  console.log("DELETING ID:", id);
  try {
    const deletedPackage = await packageModel.findOneAndDelete({ _id: id });
    res.status(201).json({ message: "Package deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createPackage,
  deletePackage,
  updatePackage,
  getPackages,
};
