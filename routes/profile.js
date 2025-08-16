const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const Listing = require("../models/listing.js"); // Ensure Listing model is imported
const Booking = require("../models/booking.js"); // Ensure Booking model is imported
const { isLoggedIn } = require("../middleware");

router.get("/", isLoggedIn, async (req, res) => {
  try {
    console.log("User ID from session:", req.user?._id);


    const user = await User.findById(req.user._id);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/");
    }


    const listings = await Listing.find({ owner: req.user._id });
    console.log("User Listings Found:", listings); 
  


    const bookings = await Booking.find({ user: req.user._id }).populate("listing", "title");
  

    res.render("../views/listings/profile.ejs", { user, listings, bookings });
  } catch (err) {
    console.error("Profile Route Error:", err);
    req.flash("error", "Something went wrong");
    res.redirect("/");
  }
});

module.exports = router;
