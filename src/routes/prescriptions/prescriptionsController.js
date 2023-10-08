const prescriptionsModel = require("../../models/prescriptionsModel");

//get all prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prescriptionsModel.find({});
    res.status(200).json(prescriptions);
  } catch (err) {
    res.status(500).json({ message: "Error in getting all the prescriptions" });
  }
};

//get a single prescription
const getSinglePrescription = async (req, res) => {
  try {
    const prescription = await prescriptionsModel.findById(req.params.id);
    res.status(200).json(prescription);
  } catch (err) {
    res.status(500).json({ message: "Prescription not found" });
  }
};

//create a prescription
const createPrescription = async (req, res) => {
  const prescription = new prescriptionsModel({
    patientEmail: req.body.patientEmail,
    patientName: req.body.patientName,
    doctorEmail: req.body.doctorEmail,
    doctorName: req.body.doctorName,
    date: Date.now(),
    filled: req.body.filled,
    medicines: req.body.medicines,
  });
  try {
    const newPrescription = await prescription.save();
    res.status(200).json(newPrescription);
  } catch (err) {
    res.status(500).json({ message: "Error creating a prescription" });
  }
};

//update a prescription
const updatePrescription = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedPrescription = await prescriptionsModel.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    res.status(200).json(updatedPrescription);
  } catch (err) {
    res.status(500).json({ message: "Error updating prescription" });
  }
};

//delete a prescription
const deletePrescription = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedPrescription = await prescriptionsModel.findByIdAndDelete(id);
    res.status(200).json(deletedPrescription);
  } catch (err) {
    res.status(500).json({ message: "Error deleting prescription" });
  }
};

module.exports = {
  getAllPrescriptions,
  getSinglePrescription,
  createPrescription,
  updatePrescription,
  deletePrescription,
};
