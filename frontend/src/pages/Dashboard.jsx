import { useState, useEffect } from "react";

function Dashboard() {
  const user =
    JSON.parse(
      localStorage.getItem(
        "quickserveUser"
      ) || "null"
    );

  const [counts, setCounts] =
    useState({
      services: null,
      bookings: null,
      reviews: null,
      users: null
    });

  useEffect(() => {
    async function load() {
      try {
        const [s, b, r, u] =
          await Promise.all([
            fetch("http://localhost:5000/api/services")
              .then((res) => res.json())
              .then((d) => (Array.isArray(d) ? d.length : (d?.length ?? d?.total ?? 0)))
              .catch(() => null),
            fetch("http://localhost:5000/api/bookings")
              .then((res) => res.json())
              .then((d) => (Array.isArray(d) ? d.length : (d?.length ?? 0)))
              .catch(() => null),
            fetch("http://localhost:5000/api/reviews")
              .then((res) => res.json())
              .then((d) => (Array.isArray(d) ? d.length : (d?.length ?? 0)))
              .catch(() => null),
            fetch("http://localhost:5000/api/users")
              .then((res) => res.json())
              .then((d) => (Array.isArray(d) ? d.length : (d?.length ?? 0)))
              .catch(() => null)
          ]);

        setCounts({ services: s, bookings: b, reviews: r, users: u });
      } catch (err) {
        // ignore; show placeholders
      }
    }

    load();
  }, []);

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <span>Welcome</span>
        <h1>{user?.name || "Guest"}</h1>
        <p>Overview of your QuickServe account</p>
      </div>

      <div className="dashboard-stats">

        <div className="dashboard-stat">
          <div className="dashboard-stat-icon">🛠️</div>
          <strong>{counts.services ?? "—"}</strong>
          <span>Services</span>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-stat-icon">📅</div>
          <strong>{counts.bookings ?? "—"}</strong>
          <span>Bookings</span>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-stat-icon">⭐</div>
          <strong>{counts.reviews ?? "—"}</strong>
          <span>Reviews</span>
        </div>

        <div className="dashboard-stat">
          <div className="dashboard-stat-icon">👥</div>
          <strong>{counts.users ?? "—"}</strong>
          <span>Users</span>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h2>Your Profile</h2>
          <p>
            {user
              ? `Name: ${user.name} — Role: ${user.role}`
              : "Please login to view profile."}
          </p>
        </div>

        <div className="dashboard-card">
          <h2>Quick Actions</h2>
          <p>
            {user?.role === "provider"
              ? "Add or manage your services from the Add Service page."
              : "Browse services and make bookings."}
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;
