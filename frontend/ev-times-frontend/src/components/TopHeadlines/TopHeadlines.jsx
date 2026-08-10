import "./TopHeadlines.css";
import { resolveImage } from "../../utils/news";

const TopHeadlines = ({ news }) => {

  if (!news || news.length === 0) return null;

  const mainNews = news[0];
  const sideNews = news.slice(1, 5);

  return (
    <section className="top-headlines">

      <div className="main-headline">

        <img
          src={
            resolveImage(mainNews.imageUrl)
          }
          alt={mainNews.title}
        />

        <div className="headline-content">
          <span>{mainNews.category}</span>

          <h2>{mainNews.title}</h2>

         <p>
  {mainNews.description}
</p>
        </div>

      </div>

      <div className="trending-sidebar">

        <h3>🔥 Trending</h3>

        {sideNews.map((item) => (
          <div key={item.id} className="sidebar-news">

            <h4>{item.title}</h4>

            <span>{item.category}</span>

          </div>
        ))}

      </div>

    </section>
  );
};

export default TopHeadlines;