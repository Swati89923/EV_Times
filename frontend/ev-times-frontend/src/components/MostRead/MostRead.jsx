import { Link } from "react-router-dom";
import "./MostRead.css";
import { resolveImage } from "../../utils/news";

const MostRead = ({ news }) => {

  if (!news || news.length === 0) return null;

  return (
    <section className="most-read">

      <div className="container">

        <div className="most-read-header">
          <h2>🔥 Most Read Today</h2>
          <span>Top stories readers are viewing</span>
        </div>

        <div className="most-read-list">

          {news.slice(0, 5).map((item, index) => (

            <Link
              key={item.id}
              to={`/news/${item.id}`}
              className="most-read-item"
            >

              <div className="most-read-rank">
                {String(index + 1).padStart(2, "0")}
              </div>

              <img
                src={
                  resolveImage(item.imageUrl)
                }
                alt={item.title}
              />

              <div className="most-read-content">

                <span className="category">
                  {item.category}
                </span>

                <h3>{item.title}</h3>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
};

export default MostRead;