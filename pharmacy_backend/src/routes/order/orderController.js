const Sales = require("../../../../models/salesModel");
const Order = require("../../../../models/orderModel");
const Medicine = require("../../../../models/medicineModel");
const Patient = require("../../../../models/patientModel");
const mongoose = require("mongoose");

// cancel order controller
const getOrders = async (req, res) => {
  const user = req.user;

  try {
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    const patient = await Patient.findOne({ username: user.username });

    if (!patient) {
      res.status(404).json({ message: "Patient not found" });
    }

    const orders = await Order.find({ patientUsername: patient.username });

    if (!orders) {
      res.status(404).json({ message: "Orders not found" });
    }

    res
      .status(200)
      .json({ mssg: "Orders are brought successfully to the patient", orders });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

const cancelOrder = async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Order not found" });
  }

  try {
    const updatedOrder = await Order.findById(id);

    if (!updatedOrder) {
      res.status(404).json({ message: "Order not found" });
    }

    const paymentMethod = updatedOrder.paymentMethod;
    const totalPrice = updatedOrder.totalPrice;
    const sales = updatedOrder.sales;

    // fetch the patient from the order
    const patientUsername = updatedOrder.patientUsername;
    const patient = await Patient.findOne({ username: patientUsername });

    if (paymentMethod === "WALLET") {
      const newWallet = patient.wallet + totalPrice;
      patient.wallet = newWallet;
    }

    await patient.save();

    for (let i = 0; i < sales.length; i++) {
      // fetch sale from sales collection
      const sale = await Sales.findOne({ _id: sales[i] });

      console.log("SALE");
      console.log(sales[i]);
      console.log(sale);

      const medicineId = sale.medicineId;
      const medicineQuantity = sale.quantity;

      // update the medicine quantity
      const medicine = await Medicine.findById(medicineId);
      const newQuantity = medicine.availableQuantity + medicineQuantity;
      medicine.availableQuantity = newQuantity;

      await medicine.save();

      // delete the sale from sales collection
      await Sales.findByIdAndDelete(sales[i]);
    }

    // update the order status and sales array
    const newOrder = await Order.findByIdAndUpdate(
      id,
      { status: "CANCELLED", sales: [] },
      { new: true }
    );

    res.status(200).json({
      mssg: "Order is cancelled successfully",
      order: newOrder,
      user: patient,
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  cancelOrder,
};
