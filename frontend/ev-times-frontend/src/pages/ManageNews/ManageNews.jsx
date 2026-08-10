import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import "./ManageNews.css";

const ManageNews = () => {

const [newsList, setNewsList] = useState([]);
const navigate = useNavigate();
const toast = useToast();

useEffect(() => {
fetchNews();
}, []);

const fetchNews = async () => {
try {

  const response = await api.get("/news?page=0&size=20");

  setNewsList(response.data.content);

} catch {
  toast.error("Couldn't load news list.");
}


};

const deleteNews = async (id) => {


const confirmDelete =
  window.confirm(
    "Are you sure you want to delete this news?"
  );

if (!confirmDelete) return;

try {

  // DELETE /news/delete/{id} requires ROLE_ADMIN — the shared `api`
  // client attaches the JWT automatically.
  await api.delete(`/news/delete/${id}`);

  toast.success("News deleted");
  fetchNews();

} catch (error) {
  toast.error(error.response?.data?.message || "Failed to delete news.");
}


};

return (

<div className="manage-news">

  <h1>Manage News</h1>

  <div className="news-table-wrapper">

    <table className="news-table">

      <thead>
        
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Category</th>
          <th>Author</th>
          <th>Action</th>
          <th>View</th>
        </tr>

      </thead>

      <tbody>

        {newsList.map((news) => (

          <tr key={news.id}>

            <td>{news.id}</td>

            <td className="news-title">
              {news.title}
            </td>

            <td>
              <span className="category-badge">
                {news.category}
              </span>
            </td>

            <td>{news.author}</td>

            <td>

              <div className="action-buttons">

                <button
                  className="edit-btn"
                  onClick={() =>
                    navigate(`/edit-news/${news.id}`)
                  }
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteNews(news.id)
                  }
                >
                  Delete
                </button>

              </div>

            </td>

            <td>

              <button
                className="read-btn"
                onClick={() =>
                  navigate(`/news/${news.id}`)
                }
              >
                Read
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

</div>


);
};

export default ManageNews;
