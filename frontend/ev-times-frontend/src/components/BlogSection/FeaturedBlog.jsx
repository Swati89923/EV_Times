import { FaUser, FaClock, FaArrowRight } from "react-icons/fa";
import "./BlogSection.css";

const FeaturedBlog = ({ blog }) => {

  if (!blog) return null;

  const openSource = (e) => {
    e.stopPropagation(); // Parent click ko trigger nahi karega
    window.open(blog.sourceUrl, "_blank");
  };

  return (

    <div
      className="featured-blog-card"
      onClick={() => window.open(blog.sourceUrl, "_blank")}
    >

      <img
        src={
          blog.imageUrl ||
          "https://images.unsplash.com/photo-1593941707882-a5bba53b3f87?w=1200"
        }
        alt={blog.title}
        className="featured-blog-image"
      />

      <div className="featured-blog-content">

        <span className="featured-category">
          {blog.category}
        </span>

        <h2>{blog.title}</h2>

        <p>
          {blog.description?.length > 180
            ? blog.description.substring(0, 180) + "..."
            : blog.description}
        </p>

        <div className="featured-meta">

          <span>
            <FaUser /> {blog.author}
          </span>

          <span>
            <FaClock /> {blog.readingTime}
          </span>

        </div>

        <button
          className="read-more-btn"
          onClick={openSource}
        >
          Read More <FaArrowRight />
        </button>

      </div>

    </div>

  );
};

export default FeaturedBlog;