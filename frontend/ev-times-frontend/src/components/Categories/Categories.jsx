import "./Categories.css";

const Categories = ({
  selectedCategory,
  setSelectedCategory,
}) => {
  const categories = [
    {
      name: "Technology",
      icon: "🚗",
      desc: "EV software, AI & innovation",
    },
    {
      name: "Battery",
      icon: "🔋",
      desc: "Battery technology updates",
    },
    {
      name: "Charging",
      icon: "⚡",
      desc: "Fast charging & networks",
    },
    {
      name: "Infrastructure",
      icon: "🏭",
      desc: "EV ecosystem growth",
    },
    {
      name: "Market",
      icon: "📈",
      desc: "Industry trends & reports",
    },
    {
      name: "Policy",
      icon: "📜",
      desc: "Government regulations",
    },
  ];

  const handleCategoryClick = (category) => {

    setSelectedCategory(category);

    const newsSection = document.getElementById("trending-news");

    if (newsSection) {
      newsSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="categories">

      <div className="category-header">

        <span>⚡ EV NEWS CATEGORIES</span>

        <h2>Explore Every EV Sector</h2>

        <p>
          Stay updated with the latest developments across
          electric vehicles, batteries, charging and policy.
        </p>

      </div>

      <div className="category-grid">

        {categories.map((item) => (

          <div
            key={item.name}
            className={
              selectedCategory === item.name
                ? "category-card active"
                : "category-card"
            }
            onClick={() => handleCategoryClick(item.name)}
          >

            <div className="category-top">

              <span className="category-icon">
                {item.icon}
              </span>

            </div>

            <h3>{item.name}</h3>

            <p>{item.desc}</p>

            <span
              className="explore-link"
              onClick={(e) => {
                e.stopPropagation();
                handleCategoryClick(item.name);
              }}
            >
              View News →
            </span>

          </div>

        ))}

      </div>

    </section>
  );
};

export default Categories;