const express = require("express");
const router = express.Router();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-08-01",
});


router.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

router.post("/create-payment-intent", async (req, res) => {
  const { amount, description } = req.body;
  console.log("amount", amount);
  console.log("req.body", req.body);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "EUR",
      // to integer
      amount:  amount.toFixed(0),
      // customer username
      description: description,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
});

module.exports = router;
