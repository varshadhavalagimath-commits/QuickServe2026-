import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState({});

  const [loadingServices, setLoadingServices] = useState(true);
  const [reviewErrors, setReviewErrors] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function loadProvider() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/providers/${id}`
        );

        if (!res.ok) {
          throw new Error("Provider not found");
        }

        const data = await res.json();

        if (!cancelled) {
          setProvider(data);
        }
      } catch (err) {
        console.error("Provider loading error:", err);

        if (!cancelled) {
          alert("Error loading provider: " + err.message);
        }
      }
    }

    if (id) {
      loadProvider();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      try {
        setLoadingServices(true);

        const res = await fetch("http://localhost:5000/api/services");

        if (!res.ok) {
          throw new Error("Failed to load services");
        }

        const data = await res.json();
        const allServices = Array.isArray(data) ? data : data.services || [];

        const providerServices = allServices.filter((service) => {
          const serviceProviderId =
            service.provider?._id ||
            service.providerId?._id ||
            service.providerId ||
            service.provider;

          return String(serviceProviderId) === String(id);
        });

        if (cancelled) return;

        setServices(providerServices);

        const reviewsMap = {};
        const errorsMap = {};

        await Promise.all(
          providerServices.map(async (service) => {
            try {
              const reviewRes = await fetch(
                `http://localhost:5000/api/reviews/service/${service._id}`
              );

              const reviewData = await reviewRes.json();

              if (!reviewRes.ok) {
                throw new Error(
                  reviewData.message || "Failed to load reviews"
                );
              }

              const reviewList = Array.isArray(reviewData)
                ? reviewData
                : Array.isArray(reviewData.reviews)
                ? reviewData.reviews
                : [];

              reviewsMap[service._id] = reviewList;
            } catch (error) {
              console.error("Review fetching error:", service._id, error);
              reviewsMap[service._id] = [];
              errorsMap[service._id] = error.message;
            }
          })
        );

        if (!cancelled) {
          setReviews(reviewsMap);
          setReviewErrors(errorsMap);
        }
      } catch (err) {
        console.error("Service loading error:", err);
      } finally {
        if (!cancelled) {
          setLoadingServices(false);
        }
      }
    }

    if (provider && id) {
      loadServices();
    }

    return () => {
      cancelled = true;
    };
  }, [provider, id]);

  function canDelete() {
    const user = JSON.parse(
      localStorage.getItem("quickserveUser") || "null"
    );

    return user && String(user._id) === String(id);
  }

  async function handleDelete() {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      const user = JSON.parse(
        localStorage.getItem("quickserveUser") || "null"
      );

      if (!user) {
        return alert("Not logged in");
      }

      const res = await fetch(
        `http://localhost:5000/api/users/${user._id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      localStorage.removeItem("quickserveUser");
      alert("Account deleted");
      navigate("/");
    } catch (err) {
      alert("Error deleting account: " + err.message);
    }
  }

  if (!provider) {
    return (
      <div className="provider-profile">
        <p>Loading provider profile...</p>
      </div>
    );
  }

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

        {loadingServices ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p className="no-services">No services added yet</p>
        ) : (
          <div className="services-list">
            {services.map((service) => {
              const serviceReviews = reviews[service._id] || [];

              return (
                <div key={service._id} className="service-review-card">
                  <div className="service-header">
                    <h3>{service.title || service.name}</h3>
                    <span className="service-price">₹{service.price}</span>
                  </div>

                  <p className="service-desc">{service.description}</p>

                  <div className="service-meta">
                    <span>📂 {service.category}</span>
                    <span>📍 {service.location}</span>
                    <span>
                      ⭐ {service.rating || 0} ({service.totalReviews ?? serviceReviews.length} reviews)
                    </span>
                  </div>

                  <div className="reviews-section">
                    <h4>Customer Reviews</h4>

                    {reviewErrors[service._id] ? (
                      <p className="no-reviews">
                        Unable to load reviews: {reviewErrors[service._id]}
                      </p>
                    ) : serviceReviews.length > 0 ? (
                      <div className="reviews-list">
                        {serviceReviews.map((review) => (
                          <div key={review._id} className="review-message-row">
                            <div className="review-message-avatar">
                              {(review.customerName || review.customer?.name || "A")
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div className="review-message-bubble">
                              <div className="review-message-top">
                                <strong>
                                  {review.customerName || review.customer?.name || "Anonymous"}
                                </strong>
                                <span className="review-rating">
                                  ⭐ {review.rating}/5
                                </span>
                              </div>

                              <p className="review-comment">“{review.comment}”</p>

                              <small className="review-date">
                                {review.createdAt
                                  ? new Date(review.createdAt).toLocaleDateString()
                                  : "Recent"}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-reviews">No reviews yet</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProviderProfile;