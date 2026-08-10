import { useNavigate } from "react-router-dom";
import "./FeaturedArticle.css";
import { resolveImage } from "../../utils/news";

const FeaturedArticle = ({ news }) => {
  const navigate = useNavigate();

  if (!news) return null;

  return (
    <section className="featured">

      <div className="featured-image">

        <img
          src={
            resolveImage(news.imageUrl)
          }
          alt={news.title}
        />

      </div>

      <div className="featured-content">

        <div className="featured-badge">
          🔥 Featured Story
        </div>

        <h2>
          {news.title}
        </h2>

        <div className="featured-meta">

          <span>
            👤 {news.author || "EV Times"}
          </span>

          <span>
            📰 {news.category}
          </span>

          <span>
            🕒 5 min read
          </span>

        </div>

        <p>
          {news.description?.length > 250
            ? news.description.substring(0, 250) + "..."
            : news.description}
        </p>

        <button
          className="featured-btn"
          onClick={() =>
            navigate(`/news/${news.id}`)
          }
        >
          Read Full Story →
        </button>

      </div>

    </section>
  );
};

export default FeaturedArticle;