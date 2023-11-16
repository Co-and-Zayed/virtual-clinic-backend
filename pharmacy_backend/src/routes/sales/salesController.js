const Patient = require("../../../../models/patientModel");
const Medicine = require("../../../../models/medicineModel");
const Sales = require("../../../../models/salesModel");

const createSale = async (req, res) => {
  const { patientUsername, medicineId, quantity } = req.body;

  // Check if medicine has enough quantity
  const medicine = await Medicine.findById(medicineId);
  if (medicine.availableQuantity < quantity) {
    return res.status(409).json({ message: "Not enough quantity" });
  }

  const newSale = new Sales({
    patientUsername,
    medicineId,
    date: new Date(),
    quantity,
  });
  try {
    await newSale.save();

    // Update the medicine's available quantity
    medicine.availableQuantity -= quantity;
    await medicine.save();

    res.status(201).json(newSale);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  createSale,
};
