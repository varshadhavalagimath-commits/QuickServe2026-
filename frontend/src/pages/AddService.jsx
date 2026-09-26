import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

function AddService() {

  const navigate =
    useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem(
        "quickserveUser"
      )
    );

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      category: "Home Repair",
      price: "",
      location: "",
      availability: "Available"
    });

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  }

  async function addService(e) {

    e.preventDefault();

    if (
      !user ||
      user.role !== "provider"
    ) {

      alert(
        "Only providers can add services."
      );

      return;
    }

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/services",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              ...form,
              price:
                Number(form.price),
              provider:
                user._id
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
        "Service added successfully!"
      );

      navigate("/services");

    } catch (error) {

      alert(
        "Could not add service."
      );

    }
  }

  return (
    <div className="form-page">

      <div className="form-page-header">

        <span>
          PROVIDER CENTER
        </span>

        <h1>
          Add a new service
        </h1>

        <p>
          Tell customers what service
          you provide.
        </p>

      </div>

      <form
        className="service-form"
        onSubmit={addService}
      >

        <div className="form-row">

          <div className="input-group">

            <label>
              Service Name
            </label>

            <input
              name="title"
              placeholder="Example: AC Repair"
              value={form.title}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
            >

              <option>
                Home Repair
              </option>

              <option>
                Cleaning
              </option>

              <option>
                Technology
              </option>

              <option>
                Beauty
              </option>

              <option>
                Automobile
              </option>

              <option>
                Education
              </option>

              <option>
                Electrical
              </option>

              <option>
                Gardening
              </option>

            </select>

          </div>

        </div>

        <div className="input-group">

          <label>
            Description
          </label>

          <textarea
            name="description"
            placeholder="Describe your service..."
            value={form.description}
            onChange={handleChange}
            required
          />

        </div>

        <div className="form-row">

          <div className="input-group">

            <label>
              Price
            </label>

            <input
              name="price"
              type="number"
              placeholder="₹ Price"
              value={form.price}
              onChange={handleChange}
              required
            />

          </div>

          <div className="input-group">

            <label>
              Location
            </label>

            <input
              name="location"
              placeholder="Example: Bengaluru"
              value={form.location}
              onChange={handleChange}
              required
            />

          </div>

        </div>

        <div className="input-group">

          <label>
            Availability
          </label>

          <select
            name="availability"
            value={form.availability}
            onChange={handleChange}
          >

            <option>
              Available
            </option>

            <option>
              Weekdays
            </option>

            <option>
              Weekends
            </option>

            <option>
              Not Available
            </option>

          </select>

        </div>

        <button
          className="large-submit"
          type="submit"
        >
          Publish Service →
        </button>

      </form>

    </div>
  );
}

export default AddService;