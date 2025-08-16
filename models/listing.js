const { ref, string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const Review = require("./review.js");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  country: {
    type: String,
    require: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Trending",
      "Bedrooms",
      "Iconic Cities",
      "Mountains",
      "Castles",
      "Amazing Pools",
      "Camping",
      "Farms",
      "Artics",
      
    ],
  },
  features: {
    type: [String], // Array of selected features
    required: true,
    enum: [
      "Free Parking",
      "WiFi",
      "Hot Water",
      "24 hrs Electricity",
      "Security Guard",
      "Balcony",
      "Kitchen",
      "Gym",
      "Furniture",
    ], // Predefined list of available features
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("listing", listingSchema);

module.exports = listing;
