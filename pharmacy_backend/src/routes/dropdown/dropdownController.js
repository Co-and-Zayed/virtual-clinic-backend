const Pharmacist = require("../../../../models/pharmacistModel.js");

// Get list of all specialities
const getSpecialities = async (req, res) => {
  try {
    const specialities = await Pharmacist.find().distinct("specialty");
    res.status(200).json(specialities);
  } catch (error) {
    console.error("Error getting specialities:", error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

module.exports = { getSpecialities };
