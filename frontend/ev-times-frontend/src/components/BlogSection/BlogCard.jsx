import { FaUser, FaClock } from "react-icons/fa";
import "./BlogSection.css";

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">

      <img
        src={
          blog.imageUrl ||
          "https://images.unsplash.com/photo-1593941707882-a5bba53b3f87?w=1200"
        }
        alt={blog.title}
        className="blog-card-image"
      />

      <div className="blog-card-content">

        <span className="blog-category">
          {blog.category}
        </span>

        <h3>{blog.title}</h3>

        <p>
          {blog.description?.length > 90
            ? blog.description.substring(0, 90) + "..."
            : blog.description}
        </p>

        <div className="blog-meta">

          <span>
            <FaUser /> {blog.author}
          </span>

          <span>
            <FaClock /> {blog.readingTime}
          </span>

        </div>

      </div>

    </div>
  );
};

export default BlogCard;