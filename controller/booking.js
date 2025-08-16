// controller/booking.js
const Booking = require('../models/booking'); // We'll create this model
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.createBookingIntent = async (req, res) => {
  try {
    const { date, name, email } = req.body;

    const options = {
      amount: 5000 * 100, // ₹5000 in paise
      currency: "INR",
      receipt: "receipt#1",
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ orderId: order.id, date, name, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Payment setup failed" });
  }
};
