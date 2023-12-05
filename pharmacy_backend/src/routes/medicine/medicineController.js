const Pharmacist = require("../../../../models/pharmacistModel");
const Patient = require("../../../../models/patientModel");
const Medicine = require("../../../../models/medicineModel");
const Sales = require("../../../../models/salesModel");
const Order = require("../../../../models/orderModel");
const mongoose = require("mongoose");
const { getBucketName } = require("../../../../utils/getBucketName");

// Generate a medicine json object for the medicine: "Aspirin"
const generateMedicine = () => {
  return {
    name: "Aspirin",
    picture: "https://www.drugs.com/images/pills/fio/AAN00410.JPG",
    price: 10,
    description:
      "Aspirin is a salicylate (sa-LIS-il-ate). It works by reducing substances in the body that cause pain, fever, and inflammation.",
    mainActiveIngredient: "Aspirin",
    otherActiveIngredients: [
      "Hypromellose",
      "Microcrystalline cellulose",
      "Mineral oil",
      "Polyethylene glycol",
      "Polysorbate 80",
      "Starch",
      "Stearic acid",
      "Titanium dioxide",
    ],
    medicinalUse: ["Headache", "Fever", "Pain"],
    availableQuantity: 100,
    status: "AVAILABLE",
  };
};

const createMedicine = async (req, res) => {
  const user = req.user;

  if (!user) {
    res.status(400).json({ message: "Valid user is required" });
    return;
  }

  console.log("USER", user);
  console.log("NEW MEDICINE FILES", req.files);

  try {
    console.log("BALABIZO 1");
    const picture = getBucketName(req, req.files[0].originalname);
    console.log("BALABIZO 2");

    const {
      name,
      price,
      description,
      mainActiveIngredient,
      otherActiveIngredients,
      medicinalUse,
      availableQuantity,
    } = req.body;

    console.log("OTHER INGREDIETNTS");
    console.log(otherActiveIngredients.split(","));

    const newOther = otherActiveIngredients.split(",");
    const newUses = medicinalUse.split(",");

    const newMedicine = new Medicine({
      name,
      picture,
      price,
      description,
      mainActiveIngredient,
      otherActiveIngredients: newOther,
      medicinalUse: newUses,
      availableQuantity,
    });
    const medicine = await newMedicine.save();
    console.log("BALABIZO 3");

    res.status(201).json(medicine);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateMedicineImage = async (req, res) => {
  const { id } = req.params;
  console.log("UPDATING IMAGE");
  console.log(id);
  console.log(req.files);
  const picture = getBucketName(req, req.files[0].originalname);
  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(
      id,
      { picture },
      {
        new: true,
      }
    );

    // res.status(200).json(updatedMedicine);
  } catch (error) {
    // res.status(409).json({ message: error.message });
  }
};

const editMedicine = async (req, res) => {
  const { id } = req.params;
  const params = req.body;

  if (params) {
    params.otherActiveIngredients = params?.otherActiveIngredients?.split(",");
    params.medicinalUse = params?.medicinalUse?.split(",");
    params.availableQuantity = parseInt(params?.availableQuantity);
  }

  console.log("EDIT MEDICINE");
  console.log(params);
  console.log(req.files);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Medicine not found" });
  }

  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(id, params, {
      new: true,
    });

    console.log("YAANY EH: ", params?.picture === "false");
    if (params?.picture === "null") {
      console.log("PICTURE HAS CHANGED");
      await updateMedicineImage(req, res);
    } else {
      console.log("PICTURE HAS NOT CHANGED");
    }

    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

// Get all medicines
const getMedicines = async (req, res) => {
  try {
    const medicine = await Medicine.find().lean();

    // If the user is a pharmasist, then we need to get the medicine's total sales from the sales collection
    const { type } = req.user;

    if (type === "PHARMACIST") {
      // Get the total sales for each medicine
      const medicineIds = medicine.map((med) => med._id);
      const totalSales = await Sales.aggregate([
        {
          $match: {
            medicineId: { $in: medicineIds },
          },
        },
        {
          $group: {
            _id: "$medicineId",
            totalSales: { $sum: "$quantity" },
          },
        },
      ]);

      // Map the total sales to the medicine
      const medicineWithTotalSales = medicine.map((med) => {
        const totalSale = totalSales.find(
          (totalSale) => totalSale._id.toString() === med._id.toString()
        );
        if (totalSale) {
          med.totalSales = totalSale.totalSales;
        } else {
          med.totalSales = 0;
        }
        return med;
      });

      res.status(200).json(medicineWithTotalSales);

      return;
    }

    res.status(200).json(medicine);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const filterMedicines = async (req, res) => {
  // Filter by medicinal use which is an array
  const { medicinalUse } = req.body;

  try {
    // Get the medicines that have the medicinal use
    const medicines = await Medicine.find({
      medicinalUse: { $in: medicinalUse },
    });

    res.status(200).json(medicines);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getMedicinalUses = async (req, res) => {
  try {
    const allMedicinalUses = await Medicine.find().distinct("medicinalUse");
    res.status(200).json(allMedicinalUses);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const deleteMedicine = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Medicine not found" });
  }

  try {
    await Medicine.findByIdAndRemove(id);
    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const getMedicineById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Medicine not found" });
  }

  try {
    const medicine = await Medicine.findById(id);

    // If the user is a pharmacist, then we need to get the medicine's sales records from the sales collection
    const type = req.headers["authorization"];
    if (type === "PHARMACIST") {
      const sales = await Sales.find({ medicineId: id });
      var newMedicine = medicine.toObject();
      newMedicine.sales = sales;

      // Total up the sales
      const totalSales = sales.reduce((acc, curr) => acc + curr.quantity, 0);
      newMedicine.totalSales = totalSales;

      res.status(200).json(newMedicine);
      return;
    }

    // Check if the medicine is out of stock
    if (medicine.availableQuantity === 0) {
      const similarAvailableMedicines = await Medicine.find({
        mainActiveIngredient: medicine.mainActiveIngredient,
        availableQuantity: { $gt: 0 },
      });

      res.status(200).json({
        medicine: medicine,
        similarAvailableMedicines,
      });
    } else {
      res.status(200).json({ medicine: medicine });
    }
    // res.status(200).json(medicine);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const buyMedicines = async (req, res) => {
  // access the patient's username, whether they want to pay with their wallet, the total price, and the cart

  const user = req.user;
  const { paymentMethod, totalPrice, cart } = req.body;

  try {
    if (!user) {
      res.status(400).json({ message: "Valid user is required" });
      return;
    }

    const { username: patientUsername } = user;
    // Get the patient
    const patient = await Patient.findOne({ username: patientUsername });

    if (!patient) {
      throw Error("Patient not found");
    }

    // Check if the patient has enough money in their wallet
    if (patient.wallet < totalPrice && paymentMethod == "WALLET") {
      throw Error("Patient does not have enough money in their wallet");
    }

    // If the patient is paying with their wallet, then deduct the total price from their wallet
    if (paymentMethod == "WALLET") {
      patient.wallet -= totalPrice;
    }
    patient.cart = [];
    await patient.save();

    // Create a new sales record for each medicine
    let salesIds = [];
    let cartDetails = [];

    for (const medicine of cart) {
      const medicineId = medicine.medicine;
      const quantity = medicine.quantity;

      // Create a new sales record
      const newSale = new Sales({
        medicineId,
        quantity,
        date: new Date(),
        patientUsername,
      });

      const savedSale = await newSale.save();

      // Update the medicine's available quantity
      const med = await Medicine.findById(medicineId);
      cartDetails.push({ medicine: med.name, quantity: quantity });

      if (!med) {
        throw Error("Medicine not found");
      }

      med.availableQuantity -= quantity;
      await med.save();
      //push sale id
      salesIds.push(savedSale._id);
    }

    // Create a new order
    const newOrder = new Order({
      patientUsername,
      status: "PENDING",
      totalPrice,
      paymentMethod,
      date: Date.now(),
      sales: salesIds,
      cartDetails,
    });

    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ message: "Medicines bought successfully", user: patient });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  createMedicine,
  getMedicines,
  filterMedicines,
  getMedicinalUses,
  editMedicine,
  updateMedicineImage,
  deleteMedicine,
  getMedicineById,
  buyMedicines,
};
