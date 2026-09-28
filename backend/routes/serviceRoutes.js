const express = require("express");

const router = express.Router();

const Service = require("../models/Service");

// GET ALL SERVICES
router.get("/", async (req, res) => {
  try {
    const services = await Service.find()
      .populate(
        "provider",
        "name email phone location"
      )
      .sort({
        createdAt: -1
      });

    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// GET SERVICE
router.get("/:id", async (req, res) => {
  try {
    const service =
      await Service.findById(req.params.id)
        .populate(
          "provider",
          "name email phone location"
        );

    if (!service) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ADD SERVICE
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      location,
      availability,
      provider
    } = req.body;

    const service = new Service({
      title,
      description,
      category,
      price,
      location,
      availability,
      provider
    });

    await service.save();

    const populatedService =
      await Service.findById(service._id)
        .populate(
          "provider",
          "name email phone location"
        );

    res.status(201).json({
      message: "Service added successfully",
      service: populatedService
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// UPDATE SERVICE
router.put("/:id", async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("provider", "name email phone location");

    if (!updatedService) {
      return res.status(404).json({
        message: "Service not found"
      });
    }

    res.json({
      message: "Service updated successfully",
      service: updatedService
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// DELETE SERVICE
router.delete("/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Service deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;