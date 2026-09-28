import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState({});
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // Load provider details
        const res = await fetch(`http://localhost:5000/api/providers/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setProvider(data);
      } catch (err) {
        alert("Error loading provider: " + err.message);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    async function loadServices() {
      try {
        const res = await fetch(`http://localhost:5000/api/services`);
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        
        // Filter services for this provider
        const providerServices = data.filter(s => s.provider._id === id);
        setServices(providerServices);
        
        // Load reviews for each service
        const reviewsMap = {};
        for (const service of providerServices) {
          try {
            const reviewRes = await fetch(
              `http://localhost:5000/api/reviews/service/${service._id}`
            );
            if (reviewRes.ok) {
              const reviewData = await reviewRes.json();
              reviewsMap[service._id] = reviewData;
            }
          } catch (err) {
            console.error("Error loading reviews:", err);
          }
        }
        setReviews(reviewsMap);
      } catch (err) {
        console.error("Error loading services:", err);
      }
    }
    
    if (provider) {
      loadServices();
    }
  }, [provider, id]);

  function canDelete() {
    const user = JSON.parse(localStorage.getItem("quickserveUser") || "null");
    return user && user._id === id;
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;
    try {
      const user = JSON.parse(localStorage.getItem("quickserveUser") || "null");
      if (!user) return alert("Not logged in");

      const res = await fetch(`http://localhost:5000/api/users/${user._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      localStorage.removeItem("quickserveUser");
      alert("Account deleted");
      navigate("/");
    } catch (err) {
      alert("Error deleting account: " + err.message);
    }
  }

  if (!provider) return <div className="provider-profile"><p>Loading...</p></div>;

  return (
    <div className="provider-profile">
      <div className="provider-header">
        <div className="provider-avatar-large">
          {provider.name?.charAt(0)?.toUpperCase()}
        </div>
        <div className="provider-info">
          <h1>{provider.name}</h1>
          <p>📍 {provider.location || "Location not set"}</p>
          <p>📞 {provider.phone}</p>
          {provider.servicesProvided && (
            <p>🏷️ Services: {provider.servicesProvided.join(", ")}</p>
          )}
        </div>
      </div>

      {canDelete() && (
        <button onClick={handleDelete} className="danger-button">
          Delete my account
        </button>
      )}

      <div className="services-reviews-section">
        <h2>Services Offered</h2>
        
        {services.length === 0 ? (
          <p className="no-services">No services added yet</p>
        ) : (
          <div className="services-list">
            {services.map(service => (
              <div key={service._id} className="service-review-card">
                <div className="service-header">
                  <h3>{service.title}</h3>
                  <span className="service-price">₹{service.price}</span>
                </div>
                
                <p className="service-desc">{service.description}</p>
                
                <div className="service-meta">
                  <span>📂 {service.category}</span>
                  <span>📍 {service.location}</span>
                  <span>⭐ {service.rating} ({service.totalReviews} reviews)</span>
                </div>

                <button
                  className="view-reviews-button"
                  onClick={() => setSelectedService(selectedService === service._id ? null : service._id)}
                >
                  {selectedService === service._id ? "Hide Reviews" : "View Reviews"}
                </button>

                {selectedService === service._id && (
                  <div className="reviews-section">
                    <h4>Customer Reviews</h4>
                    {reviews[service._id] && reviews[service._id].length > 0 ? (
                      <div className="reviews-list">
                        {reviews[service._id].map(review => (
                          <div key={review._id} className="review-item">
                            <div className="review-header">
                              <strong>{review.customer?.name || "Anonymous"}</strong>
                              <span className="review-rating">⭐ {review.rating}/5</span>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <small className="review-date">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </small>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-reviews">No reviews yet</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderProfile;
