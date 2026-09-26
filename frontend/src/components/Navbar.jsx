import {
  Link,
  useNavigate
} from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem(
        "quickserveUser"
      )
    );

  function logout() {

    localStorage.removeItem(
      "quickserveUser"
    );

    navigate("/login");
  }

  return (
    <nav className="navbar">

      <Link
        to="/"
        className="logo"
      >
        <span>Q</span>
        QuickServe
      </Link>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/services">
          Services
        </Link>

        {user && (
          <Link to="/dashboard">
            Dashboard
          </Link>
        )}

        {user && (
          <Link to="/bookings">
            Bookings
          </Link>
        )}

        {user?.role === "provider" && (
          <Link to="/add-service">
            Add Service
          </Link>
        )}

      </div>

      <div className="nav-user">

        {!user ? (
          <>
            <Link
              className="login-link"
              to="/login"
            >
              Login
            </Link>

            <Link
              className="nav-button"
              to="/register"
            >
              Get Started
            </Link>
          </>
        ) : (

          <>
            <span className="welcome">
              Hi, {user.name}
            </span>

            <button
              className="logout-button"
              onClick={logout}
            >
              Logout
            </button>
          </>

        )}

      </div>

    </nav>
  );
}

export default Navbar;