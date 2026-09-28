// Add sample bookings via API

// async function addSampleBookings() {
//   try {
//     const users = await fetch("http://localhost:5000/api/users").then(r => r.json());
//     const services = await fetch("http://localhost:5000/api/services").then(r => r.json());

//     // Find a customer
//     const customer = users.find(u => u.role === "customer");
//     if (!customer) {
//       console.log("No customer found.");
//       return;
//     }

//     console.log(`Adding bookings for customer: ${customer.name}`);

//     // Sample bookings
//     const bookings = [
//       {
//         customer: customer._id,
//         service: services[0]?._id,
//         provider: services[0]?.provider,
//         bookingDate: "2026-10-05",
//         bookingTime: "10:00 AM",
//         address: "123 Main Street, New York",
//         status: "Completed"
//       },
//       {
//         customer: customer._id,
//         service: services[1]?._id,
//         provider: services[1]?.provider,
//         bookingDate: "2026-10-12",
//         bookingTime: "02:00 PM",
//         address: "456 Oak Avenue, New York",
//         status: "Accepted"
//       },
//       {
//         customer: customer._id,
//         service: services[2]?._id,
//         provider: services[2]?.provider,
//         bookingDate: "2026-10-18",
//         bookingTime: "09:00 AM",
//         address: "789 Pine Road, Los Angeles",
//         status: "In Progress"
//       },
//       {
//         customer: customer._id,
//         service: services[3]?._id,
//         provider: services[3]?.provider,
//         bookingDate: "2026-10-25",
//         bookingTime: "03:00 PM",
//         address: "321 Elm Street, Chicago",
//         status: "Pending"
//       }
//     ];

//     // Add each booking
//     for (const booking of bookings) {
//       if (!booking.service || !booking.provider) continue;

//       try {
//         const res = await fetch("http://localhost:5000/api/bookings", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(booking)
//         });
//         const data = await res.json();
//         console.log(`✓ Added booking: ${data.booking?.service?.title} - ${booking.status}`);
//       } catch (error) {
//         console.error(`Error adding booking:`, error);
//       }
//     }

//     console.log("\n✓ Sample bookings added successfully!");
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// addSampleBookings();
