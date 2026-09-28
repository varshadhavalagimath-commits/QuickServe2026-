const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    availability: {
      type: String,
      default: "Available"
    },

    rating: {
      type: Number,
      default: 4.5
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Service", serviceSchema);
