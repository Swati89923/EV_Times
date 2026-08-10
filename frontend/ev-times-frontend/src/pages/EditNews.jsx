import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [news, setNews] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    author: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsById();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNewsById = async () => {
    try {
      const response = await api.get(`/news/${id}`);
      setNews(response.data);
    } catch {
      toast.error("Couldn't load that article.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNews({
      ...news,
      [e.target.name]: e.target.value,
    });
  };

  const updateNews = async (e) => {
    e.preventDefault();

    try {
      // PUT /news/update/{id} requires ROLE_ADMIN — the shared `api` client
      // attaches the JWT automatically so this now actually authenticates.
      await api.put(`/news/update/${id}`, news);

      toast.success("News updated successfully");
      navigate("/manage-news");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update news.");
    }
  };

  if (loading) {
    return <div style={{ padding: "40px" }}>Loading…</div>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Edit News</h1>

      <form onSubmit={updateNews}>
        <input
          type="text"
          name="title"
          value={news.title}
          onChange={handleChange}
          placeholder="Title"
        />

        <br /><br />

        <textarea
          name="description"
          value={news.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <br /><br />

        <input
          type="text"
          name="imageUrl"
          value={news.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />

        <br /><br />

        <input
          type="text"
          name="category"
          value={news.category}
          onChange={handleChange}
          placeholder="Category"
        />

        <br /><br />

        <input
          type="text"
          name="author"
          value={news.author}
          onChange={handleChange}
          placeholder="Author"
        />

        <br /><br />

        <button type="submit">
          Update News
        </button>
      </form>
    </div>
  );
};

export default EditNews;
