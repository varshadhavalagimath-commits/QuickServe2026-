
import { useEffect, useState } from "react";

function CustomerReviews({ customerId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!customerId) {
      setError("Customer ID not found");
      setLoading(false);
      return;
    }

    async function fetchReviews() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/reviews/customer/${customerId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch reviews"
          );
        }

        setReviews(data.reviews || []);

      } catch (err) {
        console.error("Customer reviews error:", err);
        setError(err.message);

      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, [customerId]);

  if (loading) {
    return <p>Loading your reviews...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="customer-reviews">

      <h2>My Reviews</h2>

      <p>
        Total Reviews: {reviews.length}
      </p>

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <h3>No Reviews Yet</h3>
          <p>
            Reviews you submit for services will appear here.
          </p>
        </div>
      ) : (
        <div className="review-list">

          {reviews.map((review) => (
            <div
              className="review-card"
              key={review._id}
            >

              <h3>{review.serviceName}</h3>

              <p>
                <strong>Provider:</strong>{" "}
                {review.providerName}
              </p>

              <p className="review-stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </p>

              <p>{review.comment}</p>

              <small>
                Reviewed on:{" "}
                {new Date(
                  review.createdAt
                ).toLocaleDateString()}
              </small>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default CustomerReviews;