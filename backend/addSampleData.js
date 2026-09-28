// // Add sample services via API (run after backend is running)

// async function addSampleData() {
//   // First, we need some providers (users with provider role)
//   const providers = [
//     {
//       name: "John Doe",
//       email: "john@example.com",
//       password: "password123",
//       phone: "9876543210",
//       location: "New York",
//       role: "provider"
//     },
//     {
//       name: "Jane Smith",
//       email: "jane@example.com",
//       password: "password123",
//       phone: "9123456789",
//       location: "Los Angeles",
//       role: "provider"
//     },
//     {
//       name: "Mike Johnson",
//       email: "mike@example.com",
//       password: "password123",
//       phone: "9234567890",
//       location: "Chicago",
//       role: "provider"
//     }
//   ];

//   // Register providers
//   let providerIds = [];
//   for (const provider of providers) {
//     try {
//       const res = await fetch("http://localhost:5000/api/users/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(provider)
//       });
//       const data = await res.json();
//       providerIds.push(data.user._id);
//       console.log(`✓ Created provider: ${provider.name}`);
//     } catch (error) {
//       console.error(`Error creating provider ${provider.name}:`, error);
//     }
//   }

//   // Sample services
//   const services = [
//     {
//       title: "Professional Home Cleaning",
//       description: "Complete home cleaning service with eco-friendly products",
//       category: "Cleaning",
//       price: 150,
//       location: "New York",
//       availability: "Available",
//       provider: providerIds[0]
//     },
//     {
//       title: "Home Repair Specialist",
//       description: "Expert home repair services for all types of damages",
//       category: "Home Repair",
//       price: 200,
//       location: "New York",
//       availability: "Available",
//       provider: providerIds[0]
//     },
//     {
//       title: "Beauty & Makeup Services",
//       description: "Professional makeup and beauty services for all occasions",
//       category: "Beauty",
//       price: 100,
//       location: "Los Angeles",
//       availability: "Available",
//       provider: providerIds[1]
//     },
//     {
//       title: "Tech Support & Repair",
//       description: "Computer and electronics repair and maintenance",
//       category: "Technology",
//       price: 80,
//       location: "Los Angeles",
//       availability: "Available",
//       provider: providerIds[1]
//     },
//     {
//       title: "Electrical Installation",
//       description: "Professional electrical installation and wiring services",
//       category: "Electrical",
//       price: 120,
//       location: "Chicago",
//       availability: "Available",
//       provider: providerIds[2]
//     },
//     {
//       title: "Gardening & Landscaping",
//       description: "Garden design, maintenance, and landscaping services",
//       category: "Gardening",
//       price: 90,
//       location: "Chicago",
//       availability: "Available",
//       provider: providerIds[2]
//     }
//   ];

//   // Add services
//   for (const service of services) {
//     try {
//       const res = await fetch("http://localhost:5000/api/services", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(service)
//       });
//       const data = await res.json();
//       console.log(`✓ Added service: ${service.title}`);
//     } catch (error) {
//       console.error(`Error adding service ${service.title}:`, error);
//     }
//   }

//   console.log("\n✓ Sample data added successfully!");
// }

// addSampleData();
