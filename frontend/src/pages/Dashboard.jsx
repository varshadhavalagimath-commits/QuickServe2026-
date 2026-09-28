import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // 1. Initialize user state once to prevent re-parsing on every render
  const [user] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("quickserveUser") || "null");
    } catch {
      return null;
    }
  });

  const [customerBookings, setCustomerBookings] = useState([]);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. Redirect unauthenticated users
    if (!user) {
      navigate("/login");
      return;
    }

    // 3. Setup AbortController to handle unmounting/race conditions
    const controller = new AbortController();

    async function loadCustomerData() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token") || user.token;
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        };

        // Run both requests concurrently
        const [bookingsRes, reviewsRes] = await Promise.all([
          user.role === "customer"
            ? fetch(`http://localhost:5000/api/bookings/customer/${user._id}`, {
                signal: controller.signal,
                headers
              })
            : Promise.resolve(null),
          fetch(`http://localhost:5000/api/reviews`, {
            signal: controller.signal,
            headers
          })
        ]);

        if (bookingsRes && bookingsRes.ok) {
          const bookings = await bookingsRes.json();
          setCustomerBookings(Array.isArray(bookings) ? bookings : []);
        }

        if (reviewsRes && reviewsRes.ok) {
          const allReviews = await reviewsRes.json();
          if (Array.isArray(allReviews)) {
            const myReviews = allReviews.filter(
              (r) => r.customer?._id === user._id || r.customer === user._id
            );
            setCustomerReviews(myReviews);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error loading dashboard data:", err);
          setError("Failed to load dashboard data. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadCustomerData();

    return () => controller.abort();
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="empty-state">
        <h2>Please login to view your profile</h2>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const statusMap = {
      Pending: "#fbbf24",
      Accepted: "#60a5fa",
      "In Progress": "#c084fc",
      Completed: "#34d399",
      Rejected: "#f87171",
      Cancelled: "#f87171"
    };
    return statusMap[status] || "#6b7280";
  };

  const totalBookings = customerBookings.length;
  const completedBookings = customerBookings.filter(
    (b) => b.status === "Completed"
  ).length;
  const pendingBookings = customerBookings.filter(
    (b) => b.status === "Pending"
  ).length;

  return (
    <div className="customer-dashboard">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-large">
          {user.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="profile-details">
          <h1>{user.name || "User"}</h1>
          <p>📍 {user.location || "Location not set"}</p>
          <p>📧 {user.email || "No email"}</p>
          <p>📞 {user.phone || "No phone"}</p>
          <span className="user-role">
            {user.role === "customer" ? "👤 Customer" : "👨‍💼 Provider"}
          </span>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Stats Cards - Customer Specific */}
      {user.role === "customer" && (
        <div className="customer-stats">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <strong>{totalBookings}</strong>
              <span>Total Bookings</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <strong>{completedBookings}</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <strong>{pendingBookings}</strong>
              <span>Pending</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <strong>{customerReviews.length}</strong>
              <span>Reviews Left</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Bookings Section */}
      {user.role === "customer" && (
        <div className="dashboard-section">
          <h2>Your Recent Bookings</h2>
          {loading ? (
            <p>Loading...</p>
          ) : customerBookings.length === 0 ? (
            <div className="empty-section">
              <p>No bookings yet. Browse services to get started!</p>
              <Link to="/services" className="cta-link">
                Browse Services
              </Link>
            </div>
          ) : (
            <div className="bookings-grid">
              {customerBookings.slice(0, 6).map((booking) => (
                <div key={booking._id} className="booking-item">
                  <div className="booking-header">
                    <h3>{booking.service?.title || "Untitled Service"}</h3>
                    <span
                      className="booking-status"
                      style={{
                        backgroundColor: getStatusColor(booking.status),
                        color: "white"
                      }}
                    >
                      {booking.status || "Unknown"}
                    </span>
                  </div>

                  <div className="booking-details-list">
                    <p>
                      💰 <strong>₹{booking.service?.price ?? "N/A"}</strong>
                    </p>
                    <p>
                      📅 <strong>{booking.bookingDate || "Date not set"}</strong>
                    </p>
                    {booking.bookingTime && (
                      <p>
                        🕐 <strong>{booking.bookingTime}</strong>
                      </p>
                    )}
                    <p>
                      👨‍💼{" "}
                      <strong>
                        {booking.provider?.name || "Provider unassigned"}
                      </strong>
                    </p>
                    <p>
                      📍 <strong>{booking.address || "Address not provided"}</strong>
                    </p>
                  </div>

                  {booking.status === "Completed" && (
                    <div className="booking-action">
                      <small>✅ Service completed</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reviews Section */}
      <div className="dashboard-section">
        <h2>Your Reviews</h2>
        {loading ? (
          <p>Loading...</p>
        ) : customerReviews.length === 0 ? (
          <div className="empty-section">
            <p>
              {user.role === "customer"
                ? "Complete a booking and leave a review!"
                : "No reviews yet"}
            </p>
          </div>
        ) : (
          <div className="reviews-grid">
            {customerReviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header-card">
                  <div>
                    <h4>{review.service?.title || "Review"}</h4>
                    <small>{review.service?.category || ""}</small>
                  </div>
                  <span className="review-rating-badge">
                    ⭐ {review.rating}/5
                  </span>
                </div>

                <p className="review-text">"{review.comment}"</p>

                <small className="review-date">
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : ""}
                </small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;