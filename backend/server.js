require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");

const User = require("./models/User");

const Service = require("./models/Service");
const Booking = require("./models/Booking");
const Review = require("./models/Review");

// Import route files
const bookingRoutes = require("./routes/bookingRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const reviewRoutes = require("./routes/ReviewRoutes");

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
app.post("/api/users/register", async (req, res) => {
  try {
    // allow providers to send servicesProvided (comma-separated or array) and locationCoords
    const payload = { ...req.body };

    if (payload.servicesProvided && typeof payload.servicesProvided === "string") {
      payload.servicesProvided = payload.servicesProvided
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);
    }

    // normalize locationCoords if provided as {lat,lng} or array
    if (payload.locationCoords && Array.isArray(payload.locationCoords)) {
      // expect [lng, lat]
    } else if (payload.locationCoords && payload.locationCoords.latitude && payload.locationCoords.longitude) {
      payload.locationCoords = {
        type: "Point",
        coordinates: [Number(payload.locationCoords.longitude), Number(payload.locationCoords.latitude)]
      };
    } else if (payload.latitude && payload.longitude) {
      payload.locationCoords = {
        type: "Point",
        coordinates: [Number(payload.longitude), Number(payload.latitude)]
      };
    }

    const newUser = await User.create(payload);

    res.status(201).json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// LOGIN
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PROVIDER SEARCH
// GET /api/providers/search?service=cleaning&lat=..&lng=..&radius=meters
app.get("/api/providers/search", async (req, res) => {
  try {
    const { service, lat, lng, radius } = req.query;

    const match = { role: "provider" };
    if (service) {
      // case-insensitive partial match against servicesProvided array elements
      match.servicesProvided = { $regex: service, $options: "i" };
    }

    let providers;

    if (lat && lng) {
      const coords = [Number(lng), Number(lat)];
      const maxDistance = Number(radius || 5000);

      providers = await User.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: coords },
            distanceField: "dist.calculated",
            spherical: true,
            maxDistance
          }
        },
        { $match: match },
        { $project: { password: 0 } },
        { $limit: 50 }
      ]);
    } else {
      providers = await User.find(match).select("-password").limit(50);
    }

    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get provider profile
app.get("/api/providers/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user || user.role !== "provider") {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
// auth middleware
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

app.use("/api/services", serviceRoutes);


// ======================================================
// BOOKING APIs
// ======================================================

app.use("/api/bookings", bookingRoutes);


// ======================================================
// REVIEW APIs
// ======================================================

app.use("/api/reviews", reviewRoutes);




// ======================================================
// SERVER
// ======================================================

app.listen(5000, () => {
  console.log("Backend server is running on port 5000");
});