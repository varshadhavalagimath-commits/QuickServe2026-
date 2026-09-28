import Hero from "../components/Hero";
import Category from "../components/Category";
import Stats from "../components/Stats";

function Home() {

  return (
    <>

      <Hero />

      <Category />

      <Stats />

      <section className="how-section">

        <div className="section-heading">

          <span>
            HOW IT WORKS
          </span>

          <h2>
            Get your service in 3 simple steps
          </h2>

        </div>

        <div className="steps">

          <div className="step">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              🔎
            </div>

            <h3>
              Find a Service
            </h3>

            <p>
              Search for the service
              you need and explore
              local providers.
            </p>

          </div>

          <div className="step">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              📅
            </div>

            <h3>
              Book a Provider
            </h3>

            <p>
              Select your preferred
              date, time and location.
            </p>

          </div>

          <div className="step">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              ✓
            </div>

            <h3>
              Get It Done
            </h3>

            <p>
              Track your booking and
              get your service completed.
            </p>

          </div>

        </div>

      </section>

    </>
  );
}

export default Home;