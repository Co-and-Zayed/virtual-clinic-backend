const Patient = require("../../../../models/patientModel");
const Medicine = require("../../../../models/medicineModel");
const User = require("../../../../models/userModel");
const mongoose = require("mongoose");
const { create } = require("../../../../models/adminModel");

const getCart = async (req, res) => {
  try {
    const { username } = req.user; // Username from the JWT

    // Find the user by their ID and populate the "cart" field with medicine details
    const patient = await Patient.findOne({ username }).populate({
      path: "cart.medicine",
      model: "Medicine",
      select: "name picture", // Specify the fields to populate
    });

    if (!patient) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartPromises = patient.cart.map(async (cartItem) => {
      const { quantity, medicine } = cartItem;

      const medicineInfo = await Medicine.findById(medicine);

      return {
        quantity:
          quantity > medicineInfo.availableQuantity
            ? medicineInfo.availableQuantity
            : quantity,
        medicine: medicine,
        name: medicineInfo.name,
        picture: medicineInfo.picture,
        price: medicineInfo.price,
        availableQuantity: medicineInfo.availableQuantity,
      };
    });

    const cart = await Promise.all(cartPromises);

    return res.status(200).json({ cart });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCart = async (req, res) => {
  try {
    const { username } = req.user; // Username from the JWT
    const newCart = req.body.cart; // New cart from the request body

    // Find the user by their ID
    const patient = await Patient.findOneAndUpdate(
      {
        username: username,
      },
      {
        cart: newCart,
      }
    );

    if (!patient) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getCart,
  updateCart,
};
