const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },

    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    bookingDate: {
      type: String,
      required: true
    },

    bookingTime: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "In Progress",
        "Completed",
        "Rejected",
        "Cancelled"
      ],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
