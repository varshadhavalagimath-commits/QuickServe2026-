import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import AddService from "./pages/AddService";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Providers from "./pages/Providers";
import ProviderProfile from "./pages/ProviderProfile";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Navbar />

      <main>

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/services"
            element={<Services />}
          />

          <Route
            path="/add-service"
            element={<AddService />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/bookings"
            element={<Bookings />}
          />

          <Route path="/providers" element={<Providers />} />
          <Route path="/providers/:id" element={<ProviderProfile />} />

        </Routes>

      </main>

      <Footer />

    </BrowserRouter>
  );
}

export default App;