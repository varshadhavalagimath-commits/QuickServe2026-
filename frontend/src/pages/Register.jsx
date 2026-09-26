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

            body: JSON.stringify(form)
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