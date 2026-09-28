require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");
const Service = require("./models/Service");

// Sample data
const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    phone: "9876543210",
    location: "New York",
    role: "provider",
    servicesProvided: ["Cleaning", "Home Repair"]
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    phone: "9123456789",
    location: "Los Angeles",
    role: "provider",
    servicesProvided: ["Beauty", "Technology"]
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "password123",
    phone: "9234567890",
    location: "Chicago",
    role: "provider",
    servicesProvided: ["Electrical", "Gardening"]
  },
  {
    name: "Customer User",
    email: "customer@example.com",
    password: "password123",
    phone: "9345678901",
    location: "Houston",
    role: "customer"
  }
];

const sampleServices = [
  {
    title: "Professional Home Cleaning",
    description: "Complete home cleaning service with eco-friendly products",
    category: "Cleaning",
    price: 150,
    location: "New York",
    availability: "Available",
    rating: 4.8,
    totalReviews: 25,
    provider: null // Will be set after users are created
  },
  {
    title: "Home Repair Specialist",
    description: "Expert home repair services for all types of damages",
    category: "Home Repair",
    price: 200,
    location: "New York",
    availability: "Available",
    rating: 4.5,
    totalReviews: 15,
    provider: null
  },
  {
    title: "Beauty & Makeup Services",
    description: "Professional makeup and beauty services for all occasions",
    category: "Beauty",
    price: 100,
    location: "Los Angeles",
    availability: "Available",
    rating: 4.9,
    totalReviews: 32,
    provider: null
  },
  {
    title: "Tech Support & Repair",
    description: "Computer and electronics repair and maintenance",
    category: "Technology",
    price: 80,
    location: "Los Angeles",
    availability: "Available",
    rating: 4.6,
    totalReviews: 20,
    provider: null
  },
  {
    title: "Electrical Installation",
    description: "Professional electrical installation and wiring services",
    category: "Electrical",
    price: 120,
    location: "Chicago",
    availability: "Available",
    rating: 4.7,
    totalReviews: 18,
    provider: null
  },
  {
    title: "Gardening & Landscaping",
    description: "Garden design, maintenance, and landscaping services",
    category: "Gardening",
    price: 90,
    location: "Chicago",
    availability: "Available",
    rating: 4.4,
    totalReviews: 12,
    provider: null
  },
  {
    title: "Automobile Repair",
    description: "Complete auto repair and maintenance services",
    category: "Automobile",
    price: 250,
    location: "New York",
    availability: "Available",
    rating: 4.5,
    totalReviews: 22,
    provider: null
  },
  {
    title: "Online Tutoring",
    description: "Professional online tutoring for all subjects and grades",
    category: "Education",
    price: 50,
    location: "Los Angeles",
    availability: "Available",
    rating: 4.8,
    totalReviews: 28,
    provider: null
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");

    // Clear existing data
    await User.deleteMany({});
    await Service.deleteMany({});
    console.log("Cleared existing data");

    // Insert users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✓ Created ${createdUsers.length} users`);

    // Assign providers to services
    sampleServices[0].provider = createdUsers[0]._id;
    sampleServices[1].provider = createdUsers[0]._id;
    sampleServices[2].provider = createdUsers[1]._id;
    sampleServices[3].provider = createdUsers[1]._id;
    sampleServices[4].provider = createdUsers[2]._id;
    sampleServices[5].provider = createdUsers[2]._id;
    sampleServices[6].provider = createdUsers[0]._id;
    sampleServices[7].provider = createdUsers[1]._id;

    // Insert services
    const createdServices = await Service.insertMany(sampleServices);
    console.log(`✓ Created ${createdServices.length} services`);

    console.log("\n✓ Database seeded successfully!");
    console.log("\nSample Users Created:");
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
    });

    console.log("\nSample Services Created:");
    createdServices.forEach((service, index) => {
      console.log(`${index + 1}. ${service.title} - $${service.price} (${service.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
