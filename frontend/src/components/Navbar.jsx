import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("quickserveUser") || "null");

  function handleLogout() {
    localStorage.removeItem("quickserveUser");
    window.location.href = "/";
  }

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span>Q</span>
        QuickServe
      </Link>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/bookings">Bookings</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        {user && user.role === "provider" && (
          <NavLink to="/add-service" className="add-service-link">
            + Add Service
          </NavLink>
        )}
      </div>

      <div className="nav-user">
        {!user ? (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>
            <Link to="/register" className="nav-button">
              Join Now
            </Link>
          </>
        ) : (
          <>
            <span className="welcome">Hi, {user.name}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;