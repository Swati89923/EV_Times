import { useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import "./CreateNews.css";

const CreateNews = () => {
  const toast = useToast();

  const [news, setNews] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    author: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setNews({
      ...news,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Uses the shared `api` client so the JWT is attached automatically —
      // POST /news/create requires authentication on the backend now.
      await api.post("/news/create", news);

      toast.success("News created — pending admin approval");

      setNews({
        title: "",
        description: "",
        imageUrl: "",
        category: "",
        author: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create news.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-news-container">
      <div className="create-news-card">
        <h1 className="create-news-title">
          📰 Create News
        </h1>

        <form
          onSubmit={handleSubmit}
          className="news-form"
        >
          <input
            type="text"
            name="title"
            placeholder="News Title"
            value={news.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="News Description"
            value={news.description}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={news.imageUrl}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            value={news.category}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Category
            </option>

            <option value="Technology">
              Technology
            </option>

            <option value="Battery">
              Battery
            </option>

            <option value="Charging">
              Charging
            </option>

            <option value="Infrastructure">
              Infrastructure
            </option>

            <option value="Market">
              Market
            </option>

            <option value="Policy">
              Policy
            </option>
          </select>

          <input
            type="text"
            name="author"
            placeholder="Author Name"
            value={news.author}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="create-btn"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create News"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;
