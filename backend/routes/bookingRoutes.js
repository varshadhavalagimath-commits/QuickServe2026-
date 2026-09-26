const express = require("express");

const router = express.Router();

const Booking = require("../models/Booking");

// CREATE BOOKING
router.post("/", async (req, res) => {
  try {
    const {
      customer,
      service,
      provider,
      bookingDate,
      bookingTime,
      address
    } = req.body;

    const booking = new Booking({
      customer,
      service,
      provider,
      bookingDate,
      bookingTime,
      address
    });

    await booking.save();

    const result =
      await Booking.findById(booking._id)
        .populate("service")
        .populate(
          "provider",
          "name email phone"
        )
        .populate(
          "customer",
          "name email phone"
        );

    res.status(201).json({
      message: "Booking created successfully",
      booking: result
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// CUSTOMER BOOKINGS
router.get(
  "/customer/:id",
  async (req, res) => {
    try {
      const bookings =
        await Booking.find({
          customer: req.params.id
        })
          .populate("service")
          .populate(
            "provider",
            "name email phone"
          )
          .sort({
            createdAt: -1
          });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

// PROVIDER BOOKINGS
router.get(
  "/provider/:id",
  async (req, res) => {
    try {
      const bookings =
        await Booking.find({
          provider: req.params.id
        })
          .populate("service")
          .populate(
            "customer",
            "name email phone location"
          )
          .sort({
            createdAt: -1
          });

      res.json(bookings);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

// UPDATE STATUS
router.put(
  "/:id/status",
  async (req, res) => {
    try {
      const { status } = req.body;

      const booking =
        await Booking.findByIdAndUpdate(
          req.params.id,
          {
            status
          },
          {
            new: true
          }
        )
          .populate("service")
          .populate("customer")
          .populate("provider");

      res.json({
        message: "Booking status updated",
        booking
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

module.exports = router;