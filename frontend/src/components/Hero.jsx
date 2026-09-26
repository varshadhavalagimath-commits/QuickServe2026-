import { Link } from "react-router-dom";

function Hero() {

  return (
    <section className="hero">

      <div className="hero-content">

        <div className="hero-badge">
          ✦ Trusted Local Services
        </div>

        <h1>
          Find the right
          <span> service </span>
          for your needs.
        </h1>

        <p>
          QuickServe helps you discover
          trusted local professionals,
          compare services and book
          them in just a few clicks.
        </p>

        <div className="hero-buttons">

          <Link
            to="/services"
            className="primary-button"
          >
            Explore Services →
          </Link>

          <Link
            to="/register"
            className="secondary-button"
          >
            Join QuickServe
          </Link>

        </div>

        <div className="hero-trust">

          <div>
            <strong>500+</strong>
            <span>Services</span>
          </div>

          <div>
            <strong>200+</strong>
            <span>Providers</span>
          </div>

          <div>
            <strong>4.8★</strong>
            <span>Average Rating</span>
          </div>

        </div>

      </div>

      <div className="hero-visual">

        <div className="hero-circle">

          <div className="hero-icon">
            🛠️
          </div>

          <div className="floating-card card-one">
            ⭐ 4.9 Rating
          </div>

          <div className="floating-card card-two">
            ✓ Verified Provider
          </div>

          <div className="floating-card card-three">
            📍 Near You
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;