import {
  useEffect,
  useState
} from "react";

import {
  useSearchParams
} from "react-router-dom";

import ServiceCard from "../components/ServiceCard";

function Services() {

  const [services, setServices] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [sort, setSort] =
    useState("");

  const [searchParams] =
    useSearchParams();

  useEffect(() => {

    const categoryFromUrl =
      searchParams.get(
        "category"
      );

    if (categoryFromUrl) {
      setCategory(
        categoryFromUrl
      );
    }

  }, [searchParams]);

  useEffect(() => {

    fetch(
      "http://localhost:5000/api/services"
    )
      .then(res =>
        res.json()
      )
      .then(data =>
        setServices(data)
      )
      .catch(() =>
        alert(
          "Could not load services"
        )
      );

  }, []);

  let filtered =
    services.filter(service => {

      const searchMatch =
        service.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        service.description
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        service.category
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const categoryMatch =
        !category ||
        service.category ===
          category;

      const locationMatch =
        !location ||
        service.location
          .toLowerCase()
          .includes(
            location.toLowerCase()
          );

      return (
        searchMatch &&
        categoryMatch &&
        locationMatch
      );
    });

  if (sort === "price-low") {

    filtered.sort(
      (a, b) =>
        a.price - b.price
    );

  }

  if (sort === "price-high") {

    filtered.sort(
      (a, b) =>
        b.price - a.price
    );

  }

  if (sort === "rating") {

    filtered.sort(
      (a, b) =>
        b.rating - a.rating
    );

  }

  return (
    <div className="services-page">

      <div className="page-header">

        <span>
          QUICKSERVE SERVICES
        </span>

        <h1>
          Find a service near you
        </h1>

        <p>
          Browse trusted local
          professionals and book
          the service you need.
        </p>

      </div>

      <div className="filter-box">

        <div className="search-wrapper">

          🔎

          <input
            placeholder="Search service..."
            value={search}
            onChange={e =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

        <select
          value={category}
          onChange={e =>
            setCategory(
              e.target.value
            )
          }
        >

          <option value="">
            All Categories
          </option>

          <option value="Home Repair">
            Home Repair
          </option>

          <option value="Cleaning">
            Cleaning
          </option>

          <option value="Technology">
            Technology
          </option>

          <option value="Beauty">
            Beauty
          </option>

          <option value="Automobile">
            Automobile
          </option>

          <option value="Education">
            Education
          </option>

          <option value="Electrical">
            Electrical
          </option>

          <option value="Gardening">
            Gardening
          </option>

        </select>

        <input
          placeholder="📍 Location"
          value={location}
          onChange={e =>
            setLocation(
              e.target.value
            )
          }
        />

        <select
          value={sort}
          onChange={e =>
            setSort(
              e.target.value
            )
          }
        >

          <option value="">
            Sort By
          </option>

          <option value="rating">
            Highest Rated
          </option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

        </select>

      </div>

      <div className="results-count">

        {filtered.length} services found

      </div>

      <div className="service-grid">

        {filtered.length === 0 ? (

          <div className="empty-state">

            <div>
              🔍
            </div>

            <h2>
              No services found
            </h2>

            <p>
              Try changing your search
              or filters.
            </p>

          </div>

        ) : (

          filtered.map(
            service => (

              <ServiceCard
                key={
                  service._id
                }
                service={service}
              />

            )
          )

        )}

      </div>

    </div>
  );
}

export default Services;