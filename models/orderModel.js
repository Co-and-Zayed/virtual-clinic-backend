const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  patientUsername: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["WALLET", "CREDIT_CARD", "ON_DELIVERY"],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  sales: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sales",
    },
  ],
  cartDetails: [
    {
      medicine: String,
      quantity: Number,
    },
  ],
});

const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;
