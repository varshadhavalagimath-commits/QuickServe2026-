require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");

const User = require("./models/User");

const Service = require("./models/Service");
const Booking = require("./models/Booking");

const app = express();

app.use(cors());
app.use(express.json());

dns.setServers(["8.8.8.8"]);


// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Connection Error: ", error);
  });


// ======================================================
// HOME
// ======================================================

app.get("/", (req, res) => {
  res.send("QuickServe Backend server is running");
});


// ======================================================
// USER APIs
// ======================================================

// Get all users
app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


// Get user by ID
app.get("/api/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User Not Found!"
    });
  }

  res.json(user);
});


// Add user / Register
app.post("/api/users", async (req, res) => {
  const newUser = await User.create(req.body);

  res.json({
    message: "User registered successfully!",
    user: newUser
  });
});


// Update user
app.put("/api/users/:id", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({
      message: "User not found!"
    });
  }

  res.json({
    message: "User updated successfully!",
    user: updatedUser
  });
});


// Delete user
app.delete("/api/users/:id", async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(
    req.params.id
  );

  if (!deletedUser) {
    return res.status(404).json({
      message: "User Not Found!"
    });
  }

  res.json({
    message: "User deleted successfully"
  });
});


// ======================================================
// SERVICE APIs
// ======================================================

// Get all services
app.get("/api/services", async (req, res) => {
  const services = await Service.find();
  res.json(services);
});


// Get service by ID
app.get("/api/services/:id", async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return res.status(404).json({
      message: "Service Not Found!"
    });
  }

  res.json(service);
});


// Add service
app.post("/api/services", async (req, res) => {
  const newService = await Service.create(req.body);

  res.json({
    message: "Service added successfully!",
    service: newService
  });
});


// Update service
app.put("/api/services/:id", async (req, res) => {
  const updatedService = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updatedService) {
    return res.status(404).json({
      message: "Service not found!"
    });
  }

  res.json({
    message: "Service updated successfully!",
    service: updatedService
  });
});


// Delete service
app.delete("/api/services/:id", async (req, res) => {
  const deletedService = await Service.findByIdAndDelete(
    req.params.id
  );

  if (!deletedService) {
    return res.status(404).json({
      message: "Service Not Found!"
    });
  }

  res.json({
    message: "Service deleted successfully"
  });
});


// ======================================================
// BOOKING APIs
// ======================================================

// Get all bookings
app.get("/api/bookings", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});


// Get booking by ID
app.get("/api/bookings/:id", async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({
      message: "Booking Not Found!"
    });
  }

  res.json(booking);
});


// Add booking
app.post("/api/bookings", async (req, res) => {
  const newBooking = await Booking.create(req.body);

  res.json({
    message: "Booking created successfully!",
    booking: newBooking
  });
});


// Update booking
app.put("/api/bookings/:id", async (req, res) => {
  const updatedBooking = await Booking.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updatedBooking) {
    return res.status(404).json({
      message: "Booking not found!"
    });
  }

  res.json({
    message: "Booking updated successfully!",
    booking: updatedBooking
  });
});


// Delete booking
app.delete("/api/bookings/:id", async (req, res) => {
  const deletedBooking = await Booking.findByIdAndDelete(
    req.params.id
  );

  if (!deletedBooking) {
    return res.status(404).json({
      message: "Booking Not Found!"
    });
  }

  res.json({
    message: "Booking deleted successfully"
  });
});




// ======================================================
// SERVER
// ======================================================

app.listen(5000, () => {
  console.log("Backend server is running on port 5000");
});