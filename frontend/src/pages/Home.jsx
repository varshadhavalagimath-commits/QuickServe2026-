import { useEffect, useState } from "react";

import Hero from "../components/Hero";
import Category from "../components/Category";
import Stats from "../components/Stats";
import ServiceCard from "../components/ServiceCard";

function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then((data) => setFeatured((data || []).slice(0, 6)))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div>
      <Hero />

      <Category />

      <section className="featured-services">
        <div className="section-heading">
          <span>FEATURED SERVICES</span>
          <h2>Popular near you</h2>
        </div>

        <div className="service-grid">
          {featured.map((s) => (
            <ServiceCard key={s._id} service={s} />
          ))}
        </div>
      </section>

      <Stats />
    </div>
  );
}

export default Home;