import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNewsByCategory } from "../../services/newsService";
import { resolveImage } from "../../utils/news";
import { NewsCardSkeletonGrid } from "../../components/Skeleton/Skeleton";
import "./CategoryPage.css";

const CategoryPage = () => {
  const { categoryName } = useParams();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryNews();
  }, [categoryName]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCategoryNews = async () => {
    try {
      setLoading(true);
      const formattedCategory =
        categoryName.charAt(0).toUpperCase() +
        categoryName.slice(1);

      const res = await getNewsByCategory(formattedCategory);

      setNews(res.data);
    } catch {
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="category-page">
      <div className="category-hero">
        <h1>{categoryName}</h1>
        <p>{news.length} Articles Found</p>
      </div>

      {loading ? (
        <NewsCardSkeletonGrid count={6} />
      ) : (
        <div className="category-news-grid">
          {news.map((item) => (
            <div
              className="category-news-card"
              key={item.id}
            >
              <img
                src={resolveImage(item.imageUrl)}
                alt={item.title}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200";
                }}
              />

              <div className="category-news-content">
                <span className="category-badge">
                  {item.category}
                </span>

                <h3>{item.title}</h3>

                <p>
                  {item.description?.length > 120
                    ? item.description.slice(0, 120) + "..."
                    : item.description}
                </p>

                <div className="category-footer">
                  <span>
                    By {item.author}
                  </span>

                  <Link
                    to={`/news/${item.id}`}
                    className="read-more-btn"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && news.length === 0 && (
        <div className="empty-state">
          <h2>No Articles Found</h2>
          <p>
            News for this category will be
            available soon.
          </p>
        </div>
      )}
    </section>
  );
};

export default CategoryPage;
