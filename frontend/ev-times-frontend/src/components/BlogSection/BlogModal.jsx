import { FaTimes, FaUser, FaClock } from "react-icons/fa";
import "./BlogSection.css";

const BlogModal = ({ blog, onClose }) => {

  if (!blog) return null;

  return (

    <div className="blog-modal-overlay">

      <div className="blog-modal">

        <button
          className="blog-close-btn"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <img
          src={blog.imageUrl}
          alt={blog.title}
          className="blog-modal-image"
        />

        <div className="blog-modal-content">

          <span className="featured-category">
            {blog.category}
          </span>

          <h2>{blog.title}</h2>

          <div className="featured-meta">

            <span>
              <FaUser /> {blog.author}
            </span>

            <span>
              <FaClock /> {blog.readingTime}
            </span>

          </div>

          <p className="blog-description">
            {blog.description}
          </p>

          <div className="blog-full-content">
            {blog.content}
          </div>

        </div>

      </div>

    </div>

  );
};

export default BlogModal;