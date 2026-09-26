const express = require("express");

const router = express.Router();

const Review = require("../models/Review");
const Service = require("../models/Service");

// ADD REVIEW
router.post("/", async (req, res) => {
  try {
    const {
      customer,
      service,
      rating,
      comment
    } = req.body;

    const review = new Review({
      customer,
      service,
      rating,
      comment
    });

    await review.save();

    const reviews =
      await Review.find({
        service
      });

    const total = reviews.reduce(
      (sum, item) =>
        sum + item.rating,
      0
    );

    const average =
      total / reviews.length;

    await Service.findByIdAndUpdate(
      service,
      {
        rating: Number(
          average.toFixed(1)
        ),
        totalReviews: reviews.length
      }
    );

    res.status(201).json({
      message: "Review added successfully",
      review
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET REVIEWS
router.get(
  "/service/:serviceId",
  async (req, res) => {
    try {
      const reviews =
        await Review.find({
          service:
            req.params.serviceId
        })
          .populate(
            "customer",
            "name"
          )
          .sort({
            createdAt: -1
          });

      res.json(reviews);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

module.exports = router;