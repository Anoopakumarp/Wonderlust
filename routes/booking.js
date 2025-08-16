const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware"); // Ensure user is logged in
const Booking = require("../models/booking");
const Listing = require("../models/listing");

// Handle Booking Request
router.post("/:listingId", isLoggedIn, async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        const listing = await Listing.findById(req.params.listingId);

        if (!listing) {
            req.flash("error", "Listing not found");
            return res.redirect("/listings");
        }

        const booking = new Booking({
            user: req.user._id,
            listing: listing._id,
            startDate,
            endDate
        });

        await booking.save();
        req.flash("success", "Booking confirmed!");
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        req.flash("error", "Booking failed");
        res.redirect("back");
    }
});

// In routes/booking.js

// Save booking payment details
router.post("/booking/save", async (req, res) => {
    try {
        const { reservationDetails, paymentId, orderId, signature } = req.body;

        // Find booking using reservation details
        let booking = await Booking.findOne({
            listing: reservationDetails.listingId,
            startDate: reservationDetails.startDate,
            endDate: reservationDetails.endDate,
            guests: reservationDetails.guests,
            
        });

        

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Update payment info
        booking.paymentId = paymentId;
        booking.orderId = orderId;
        booking.paymentSignature = signature;
        booking.paymentStatus = "Paid";

        await booking.save();

        res.json({ message: "Booking payment updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving booking payment details" });
    }
});
// GET: Render user info form
router.get('/info', isLoggedIn, async (req, res) => {
    const { bookingId } = req.query;
    res.render('bookingForm', { bookingId });
});

// POST: Save user info and redirect to payment
router.post('/info', isLoggedIn, async (req, res) => {
    const { bookingId, guestName, email, phone } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).send('Booking not found');
    
    // Save user information to the booking
    booking.guestName = guestName;
    booking.email = email;
    booking.phone = phone;
    await booking.save();
    
    // Redirect to payment page
    res.redirect(`/booking/payment?bookingId=${bookingId}`);
});


// In routes/booking.js

// GET: Render payment page
router.get('/payment', isLoggedIn, async (req, res) => {
    const { bookingId } = req.query;
    // Create Razorpay order here and pass order details to EJS
    // Example: const order = await createRazorpayOrder(bookingId);
    // ...
    res.render('payment', { order, key_id: 'YOUR_KEY_ID', bookingId });
});


// ✅ Cancel Booking Route
router.delete("/:id", isLoggedIn, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        req.flash("success", "Booking cancelled successfully.");
        res.redirect("/profile");
    } catch (err) {
        console.error("Error deleting booking:", err);
        req.flash("error", "Failed to cancel booking.");
        res.redirect("/profile");
    }
});


module.exports = router;
