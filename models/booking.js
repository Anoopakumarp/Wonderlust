const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "listing", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
     // Payment fields
    paymentId: String,
    orderId: String,
    paymentSignature: String,
    paymentStatus: { type: String, default: "unpaid" }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
