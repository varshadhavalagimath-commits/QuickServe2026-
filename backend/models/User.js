const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String
    },

    location: {
      type: String
    },

    role: {
      type: String,
      enum: ["customer", "provider"],
      default: "customer"
    }
    ,
    servicesProvided: {
      type: [String],
      default: []
    },
    locationCoords: {
      // GeoJSON Point [lng, lat]
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  {
    timestamps: true
  }
);

// create 2dsphere index for geospatial queries
userSchema.index({ locationCoords: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
