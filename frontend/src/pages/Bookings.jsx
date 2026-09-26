import {
  useEffect,
  useState
} from "react";

import {
  Link
} from "react-router-dom";

function Bookings() {

  const user =
    JSON.parse(
      localStorage.getItem(
        "quickserveUser"
      )
    );

  const [bookings, setBookings] =
    useState([]);

  const [reviewId, setReviewId] =
    useState(null);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  useEffect(() => {

    if (!user) return;

    const url =
      user.role === "customer"
        ? `http://localhost:5000/api/bookings/customer/${user._id}`
        : `http://localhost:5000/api/bookings/provider/${user._id}`;

    fetch(url)
      .then(res =>
        res.json()
      )
      .then(data =>
        setBookings(data)
      );

  }, []);

  if (!user) {

    return (
      <div className="empty-state">

        <h2>
          Please login to see bookings.
        </h2>

        <Link to="/login">
          Login
        </Link>

      </div>
    );
  }

  async function updateStatus(
    bookingId,
    status
  ) {

    try {

      const response =
        await fetch(
          `http://localhost:5000/api/bookings/${bookingId}/status`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              status
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(data.message);

        return;
      }

      setBookings(
        bookings.map(
          booking =>
            booking._id ===
            bookingId
              ? {
                  ...booking,
                  status
                }
              : booking
        )
      );

    } catch {

      alert(
        "Could not update booking."
      );

    }
  }

  async function submitReview(
    booking
  ) {

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/reviews",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              customer:
                user._id,

              service:
                booking.service._id,

              rating,

              comment

            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(data.message);

        return;
      }

      alert(
        "Thank you for your review!"
      );

      setReviewId(null);

      setComment("");

      setRating(5);

    } catch {

      alert(
        "Could not submit review."
      );

    }
  }

  function statusClass(status) {

    return status
      .toLowerCase()
      .replace(" ", "-");
  }

  return (
    <div className="bookings-page">

      <div className="page-header">

        <span>
          BOOKING MANAGEMENT
        </span>

        <h1>
          {user.role ===
          "customer"
            ? "My Bookings"
            : "Customer Bookings"}
        </h1>

        <p>
          Track and manage your
          service bookings.
        </p>

      </div>

      {bookings.length === 0 ? (

        <div className="empty-state">

          <div>
            📅
          </div>

          <h2>
            No bookings yet
          </h2>

          <p>
            Your bookings will
            appear here.
          </p>

          <Link
            to="/services"
            className="primary-button"
          >
            Explore Services
          </Link>

        </div>

      ) : (

        <div className="booking-list">

          {bookings.map(
            booking => (

              <div
                className="booking-card-new"
                key={booking._id}
              >

                <div className="booking-service-icon">
                  🔧
                </div>

                <div className="booking-main">

                  <div className="booking-top">

                    <div>

                      <span className="service-category">
                        {booking.service?.category}
                      </span>

                      <h2>
                        {booking.service?.title}
                      </h2>

                    </div>

                    <span
                      className={`status ${statusClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                  </div>

                  <div className="booking-details">

                    <span>
                      📅 {booking.bookingDate}
                    </span>

                    <span>
                      ⏰ {booking.bookingTime ||
                        "Not specified"}
                    </span>

                    <span>
                      📍 {booking.address ||
                        "Address not specified"}
                    </span>

                  </div>

                  {user.role ===
                    "customer" && (

                    <div className="provider-row">

                      <div className="provider-avatar">
                        {booking.provider?.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {booking.provider?.name}
                        </strong>

                        <small>
                          Service Provider
                        </small>

                      </div>

                    </div>

                  )}

                  {user.role ===
                    "provider" && (

                    <div className="provider-row">

                      <div className="provider-avatar">
                        {booking.customer?.name
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>

                      <div>

                        <strong>
                          {booking.customer?.name}
                        </strong>

                        <small>
                          {booking.customer?.email}
                        </small>

                      </div>

                    </div>

                  )}

                  <div className="booking-actions">

                    {user.role ===
                      "provider" && (

                      <>

                        {booking.status ===
                          "Pending" && (

                          <>
                            <button
                              className="accept-btn"
                              onClick={() =>
                                updateStatus(
                                  booking._id,
                                  "Accepted"
                                )
                              }
                            >
                              ✓ Accept
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() =>
                                updateStatus(
                                  booking._id,
                                  "Rejected"
                                )
                              }
                            >
                              ✕ Reject
                            </button>
                          </>

                        )}

                        {booking.status ===
                          "Accepted" && (

                          <button
                            className="accept-btn"
                            onClick={() =>
                              updateStatus(
                                booking._id,
                                "In Progress"
                              )
                            }
                          >
                            Start Service
                          </button>

                        )}

                        {booking.status ===
                          "In Progress" && (

                          <button
                            className="accept-btn"
                            onClick={() =>
                              updateStatus(
                                booking._id,
                                "Completed"
                              )
                            }
                          >
                            ✓ Mark Completed
                          </button>

                        )}

                      </>

                    )}

                    {user.role ===
                      "customer" && (

                      <>

                        {booking.status ===
                          "Pending" && (

                          <button
                            className="cancel-btn"
                            onClick={() =>
                              updateStatus(
                                booking._id,
                                "Cancelled"
                              )
                            }
                          >
                            Cancel Booking
                          </button>

                        )}

                        {booking.status ===
                          "Completed" && (

                          <button
                            className="review-btn"
                            onClick={() =>
                              setReviewId(
                                booking._id
                              )
                            }
                          >
                            ⭐ Write Review
                          </button>

                        )}

                      </>

                    )}

                  </div>

                  {reviewId ===
                    booking._id && (

                    <div className="review-form">

                      <h3>
                        Rate this service
                      </h3>

                      <div className="star-rating">

                        {[1, 2, 3, 4, 5].map(
                          number => (

                            <button
                              key={number}
                              className={
                                number <=
                                rating
                                  ? "star-selected"
                                  : ""
                              }
                              onClick={() =>
                                setRating(
                                  number
                                )
                              }
                            >
                              ★
                            </button>

                          )
                        )}

                      </div>

                      <textarea
                        placeholder="Write your review..."
                        value={comment}
                        onChange={e =>
                          setComment(
                            e.target.value
                          )
                        }
                      />

                      <button
                        className="confirm-button"
                        onClick={() =>
                          submitReview(
                            booking
                          )
                        }
                      >
                        Submit Review
                      </button>

                    </div>

                  )}

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Bookings;