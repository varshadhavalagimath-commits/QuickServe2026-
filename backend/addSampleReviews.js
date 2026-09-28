// Add sample reviews via API

async function addSampleReviews() {
  // First get the customer and services
  try {
    const users = await fetch("http://localhost:5000/api/users").then(r => r.json());
    const services = await fetch("http://localhost:5000/api/services").then(r => r.json());
    
    // Find a customer
    const customer = users.find(u => u.role === "customer");
    if (!customer) {
      console.log("No customer found. Please register a customer first.");
      return;
    }

    console.log(`Found customer: ${customer.name}`);

    // Sample reviews
    const reviews = [
      {
        customer: customer._id,
        service: services[0]?._id,
        rating: 5,
        comment: "Excellent service! Very professional and on time. Highly recommended!"
      },
      {
        customer: customer._id,
        service: services[1]?._id,
        rating: 4,
        comment: "Good work, would definitely book again. Minor delay but overall satisfied."
      },
      {
        customer: customer._id,
        service: services[2]?._id,
        rating: 5,
        comment: "Amazing! The service provider was very courteous and did perfect work."
      }
    ];

    // Add each review
    for (const review of reviews) {
      if (!review.service) continue;

      try {
        const res = await fetch("http://localhost:5000/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review)
        });
        const data = await res.json();
        console.log(`✓ Added review for service: ${services.find(s => s._id === review.service)?.title}`);
      } catch (error) {
        console.error(`Error adding review:`, error);
      }
    }

    console.log("\n✓ Sample reviews added successfully!");
  } catch (error) {
    console.error("Error:", error);
  }
}

addSampleReviews();
