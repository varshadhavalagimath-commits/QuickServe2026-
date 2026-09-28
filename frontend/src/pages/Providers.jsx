import { useState } from "react";
import { Link } from "react-router-dom";

function Providers() {
  const [service, setService] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);

  async function useMyLocation() {
    if (!navigator.geolocation) return alert("Geolocation not supported");

        navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/providers/search?service=${encodeURIComponent(
          service
        )}&lat=${lat}&lng=${lng}&radius=50000`);
        const data = await res.json();
        setProviders(data);
      } catch (err) {
        alert("Error searching providers: " + err.message);
      } finally {
        setLoading(false);
      }
    });
  }

  async function handleSearch(e) {
    e && e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/providers/search?service=${encodeURIComponent(
        service
      )}`);
      const data = await res.json();
      setProviders(data);
    } catch (err) {
      alert("Error searching providers: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="providers-page">
      <h1>Find Service Providers</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          placeholder="Service (e.g. plumbing, cleaning)"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />

        <button type="submit">Search</button>
        <button type="button" onClick={useMyLocation}>
          Use my location
        </button>
      </form>

      {loading && <p>Searching...</p>}

      <div className="providers-list">
        {providers.length === 0 && <p>No providers found.</p>}

        {providers.map((p) => (
          <div key={p._id} className="provider-card">
            <h3>{p.name}</h3>
            <p>{p.location || "Location not set"}</p>
            <p>Services: {(p.servicesProvided || []).join(", ")}</p>
            {p.dist && p.dist.calculated && (
              <p>Distance: {(p.dist.calculated / 1000).toFixed(2)} km</p>
            )}
            <Link to={`/providers/${p._id}`}>View profile</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Providers;
