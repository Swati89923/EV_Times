import { Link } from "react-router-dom";
import "./MostPopular.css";
import { resolveImage } from "../../utils/news";

const MostPopular = ({ news }) => {

  const popular = news.slice(0, 5);

  return (
    <section className="popular-section">

      <h2>🔥 Most Popular This Week</h2>

      <div className="popular-list">

        {popular.map((item, index) => (

          <Link
            key={item.id}
            to={`/news/${item.id}`}
            className="popular-item"
          >

            {/* Rank */}

            <div
              className={`popular-rank ${
                index === 0
                  ? "gold"
                  : index === 1
                  ? "silver"
                  : index === 2
                  ? "bronze"
                  : ""
              }`}
            >
              {index + 1}
            </div>

            {/* Thumbnail */}

            <img
              src={
                resolveImage(item.imageUrl)
              }
              alt={item.title}
              className="popular-thumb"
            />

            {/* Content */}

            <div className="popular-content">

              <h4>{item.title}</h4>

              <div className="popular-meta">

                <span>
                  👁 {(Math.random() * 20 + 5).toFixed(1)}K Views
                </span>

                <span className="popular-category">
                  {item.category}
                </span>

              </div>

            </div>

            {/* Trending Badge */}

            {index < 3 && (
              <span className="popular-badge">
                🔥 Trending
              </span>
            )}

          </Link>

        ))}

      </div>

    </section>
  );
};

export default MostPopular;