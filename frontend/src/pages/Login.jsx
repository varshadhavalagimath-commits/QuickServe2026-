import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  async function login(e) {

    e.preventDefault();

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/users/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              email,
              password
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        alert(data.message);

        return;
      }

      localStorage.setItem(
        "quickserveUser",
        JSON.stringify(data.user)
      );

      alert("Login successful!");

      navigate("/dashboard");

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
            Welcome back
          </h1>

          <p>
            Login to your QuickServe account.
          </p>

        </div>

        <form
          className="auth-form"
          onSubmit={login}
        >

          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e =>
              setEmail(e.target.value)
            }
            required
          />

          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e =>
              setPassword(
                e.target.value
              )
            }
            required
          />

          <button
            className="auth-button"
            type="submit"
          >
            Login
          </button>

        </form>

        <p className="auth-switch">

          Don't have an account?

          <button
            onClick={() =>
              navigate("/register")
            }
          >
            Create Account
          </button>

        </p>

      </div>

    </div>
  );
}

export default Login;