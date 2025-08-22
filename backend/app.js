require("dotenv").config();
const express = require("express");
const Stripe = require("stripe");
const router = express.Router();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/payment", async (req, res) => {
  try {
    const { token } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // ₹10 in paise (INR)
      currency: "inr",
      payment_method: token,
      confirmation_method: "manual",
      confirm: true,
    });
    console.log("PaymentIntent created:", paymentIntent.id);

    res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/checkout", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000, // ₹100 in paise
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });
    console.log("PaymentIntent created:", paymentIntent.id);

    res.send({
      clientSecret: paymentIntent.client_secret, 
    });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
