import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function ServiceCard({
  service,
  onFavouriteChange
}) {

  const navigate = useNavigate();

  const [showBooking, setShowBooking] =
    useState(false);

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [favourite, setFavourite] =
    useState(() => {

      const saved =
        JSON.parse(
          localStorage.getItem(
            "quickserveFavourites"
          ) || "[]"
        );

      return saved.includes(
        service._id
      );
    });

  const user =
    JSON.parse(
      localStorage.getItem(
        "quickserveUser"
      )
    );

  function toggleFavourite() {

    if (!user) {
      alert("Please login first");
      return;
    }

    let favourites =
      JSON.parse(
        localStorage.getItem(
          "quickserveFavourites"
        ) || "[]"
      );

    if (favourite) {

      favourites =
        favourites.filter(
          id => id !== service._id
        );

    } else {

      favourites.push(
        service._id
      );
    }

    localStorage.setItem(
      "quickserveFavourites",
      JSON.stringify(favourites)
    );

    setFavourite(!favourite);

    if (onFavouriteChange) {
      onFavouriteChange();
    }
  }

  async function bookService() {

    if (!user) {

      alert("Please login first");

      navigate("/login");

      return;
    }

    if (user.role !== "customer") {

      alert(
        "Only customers can book services."
      );

      return;
    }

    if (!date) {

      alert(
        "Please select booking date."
      );

      return;
    }

    if (!address) {

      alert(
        "Please enter your address."
      );

      return;
    }

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/bookings",
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
                service._id,

              provider:
                service.provider._id,

              bookingDate:
                date,

              bookingTime:
                time,

              address:
                address

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
        "Booking created successfully!"
      );

      setShowBooking(false);

      setDate("");

      setTime("");

      setAddress("");

      navigate("/bookings");

    } catch (error) {

      alert(
        "Could not create booking."
      );

    }
  }

  return (
    <div className="service-card">

      <div className="service-image">

        <div className="service-image-icon">
          {service.category ===
          "Cleaning"
            ? "🧹"
            : service.category ===
              "Technology"
            ? "💻"
            : service.category ===
              "Beauty"
            ? "💇"
            : service.category ===
              "Automobile"
            ? "🚗"
            : "🔧"}
        </div>

        <button
          className={`favorite-button ${
            favourite
              ? "favorite-active"
              : ""
          }`}
          onClick={toggleFavourite}
        >
          {favourite ? "♥" : "♡"}
        </button>

      </div>

      <div className="service-content">

        <div className="service-category">
          {service.category}
        </div>

        <h3>
          {service.title}
        </h3>

        <p className="service-description">
          {service.description}
        </p>

        <div className="service-rating">

          <span>
            ⭐ {service.rating || 4.5}
          </span>

          <small>
            ({service.totalReviews || 0} reviews)
          </small>

        </div>

        <div className="service-info">

          <span>
            📍 {service.location}
          </span>

          <span>
            ✓ {service.availability}
          </span>

        </div>

        <Link to={`/providers/${service.provider?._id}`} className="provider-link">
          <div className="provider">

            <div className="provider-avatar">
              {service.provider?.name
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>
              <strong>
                {service.provider?.name}
              </strong>

              <small>
                Service Provider
              </small>
            </div>

          </div>
        </Link>

        <div className="service-bottom">

          <div>

            <small>
              Starting from
            </small>

            <strong>
              ₹{service.price}
            </strong>

          </div>

          <button
            className="book-button"
            onClick={() =>
              setShowBooking(
                !showBooking
              )
            }
          >
            Book Now
          </button>

        </div>

        {showBooking && (

          <div className="booking-form">

            <h4>
              Book this service
            </h4>

            <label>
              Date
            </label>

            <input
              type="date"
              value={date}
              onChange={e =>
                setDate(e.target.value)
              }
            />

            <label>
              Time
            </label>

            <input
              type="time"
              value={time}
              onChange={e =>
                setTime(e.target.value)
              }
            />

            <label>
              Service Address
            </label>

            <textarea
              placeholder="Enter your address"
              value={address}
              onChange={e =>
                setAddress(
                  e.target.value
                )
              }
            />

            <button
              className="confirm-button"
              onClick={bookService}
            >
              Confirm Booking
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default ServiceCard;