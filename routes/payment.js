const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/order", async (req, res) => {
  console.log("Order Request Body:", req.body);

  try {
    if (!req.body.amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    const options = {
      amount: req.body.amount * 10, // INR to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send("Error creating Razorpay order");
  }
});

// Verify payment
router.post("/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    console.log("Payment verified successfully!");
    res.render("listings/success"); // success.ejs
  } else {
    console.log("Payment verification failed!");
    res.render("listings/failure"); // failure.ejs
  }
});

module.exports = router;
