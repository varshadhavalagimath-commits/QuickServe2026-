import { Link } from "react-router-dom";

const categories = [
  {
    icon: "🔧",
    name: "Home Repair"
  },
  {
    icon: "🧹",
    name: "Cleaning"
  },
  {
    icon: "💻",
    name: "Technology"
  },
  {
    icon: "💇",
    name: "Beauty"
  },
  {
    icon: "🚗",
    name: "Automobile"
  },
  {
    icon: "📚",
    name: "Education"
  },
  {
    icon: "⚡",
    name: "Electrical"
  },
  {
    icon: "🌿",
    name: "Gardening"
  },
  {
    icon:"🚚",
    name:"Logistics"
  },
  {
    icon:"🏡",
    name:"Home Remodeling"
  },
  {
    icon:"👴👶",
    name:"Elder Care & Childcare Service"
  }
];

function Category() {

  return (
    <section className="category-section">

      <div className="section-heading">

        <span>
          POPULAR CATEGORIES
        </span>

        <h2>
          What service do you need?
        </h2>

        <p>
          Choose from our most popular
          service categories.
        </p>

      </div>

      <div className="category-grid">

        {categories.map(
          (category) => (

            <Link
              key={category.name}
              to={`/services?category=${category.name}`}
              className="category-card"
            >

              <div className="category-icon">
                {category.icon}
              </div>

              <h3>
                {category.name}
              </h3>

              <span>
                Explore →
              </span>

            </Link>

          )
        )}

      </div>

    </section>
  );
}

export default Category;