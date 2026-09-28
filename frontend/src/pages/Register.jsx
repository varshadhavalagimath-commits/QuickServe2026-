import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
      role: "customer"
    });

  // add provider-specific form fields
  const [services, setServices] = useState("");
  const [coords, setCoords] = useState(null);

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  }

  async function register(e) {

    e.preventDefault();

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/users/register",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              name: form.name,
              email: form.email,
              password: form.password,
              phone: form.phone,
              location: form.location,
              role: form.role,
              servicesProvided: services,
              locationCoords: coords
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
        "Account created successfully!"
      );

      navigate("/login");

    } catch (error) {

      alert(
        "Unable to connect to server."
      );

    }
  }

  return (
    <div className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <div className="auth-logo">
            Q
          </div>

          <h1>
            Create your account
          </h1>

          <p>
            Join QuickServe today.
          </p>

        </div>

        <form
          className="auth-form"
          onSubmit={register}
        >

          <label>
            Full Name
          </label>

          <input
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>
            Email
          </label>

          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>
            Password
          </label>

          <input
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <label>
            Phone
          </label>

          <input
            name="phone"
            placeholder="Phone number"
            value={form.phone}
            onChange={handleChange}
          />

          <label>
            Location
          </label>

          <input
            name="location"
            placeholder="City / Area"
            value={form.location}
            onChange={handleChange}
          />

          <label>
            Account Type
          </label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >

            <option value="customer">
              Customer
            </option>

            <option value="provider">
              Service Provider
            </option>

          </select>

          {form.role === "provider" && (
            <>
              <label>Services Provided (comma separated)</label>
              <input
                name="services"
                placeholder="plumbing, cleaning"
                value={services}
                onChange={(e) => setServices(e.target.value)}
              />

              <label>Set my location</label>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (!navigator.geolocation) return alert("Geolocation not supported");
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const lat = pos.coords.latitude;
                      const lng = pos.coords.longitude;
                      setCoords({ latitude: lat, longitude: lng });
                      setForm({ ...form, location: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
                    });
                  }}
                >
                  Use my GPS location
                </button>
                {coords && <span> Location captured</span>}
              </div>
            </>
          )}

          <button
            className="auth-button"
            type="submit"
          >
            Create Account
          </button>

        </form>

        <p className="auth-switch">

          Already have an account?

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            Login
          </button>

        </p>

      </div>

    </div>
  );
}

export default Register;