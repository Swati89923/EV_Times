import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import {
  getPendingNews,
  approveNews,
  rejectNews,
} from "../../services/newsService";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [analytics, setAnalytics] = useState({
    totalNews: 0,
    totalUsers: 0,
    totalComments: 0,
  });
const [pendingNews, setPendingNews] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [users, setUsers] = useState([]);

  const [breakingForm, setBreakingForm] = useState({
    title: "",
    link: "",
    active: true,
  });

 useEffect(() => {
  fetchAnalytics();
  fetchBreakingNews();
  fetchPendingNews();
  fetchUsers();
}, []);
  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/analytics");

      setAnalytics(response.data);
    } catch {
      toast.error("Couldn't load analytics.");
    }
  };

  const fetchBreakingNews = async () => {
    try {
      const response = await api.get("/breaking-news");

      setBreakingNews(response.data);
    } catch (error) {
      console.log(error);
    }
  };
const fetchPendingNews = async () => {
  try {
    const response = await getPendingNews();
    setPendingNews(response.data);
  } catch (error) {
    console.log(error);
  }
};

const fetchUsers = async () => {
  try {
    const response = await api.get("/admin/users");
    setUsers(response.data);
  } catch (error) {
    console.log(error);
  }
};

const handleDeleteUser = async (id) => {
  if (!window.confirm("Delete this user? This can't be undone.")) return;
  try {
    await api.delete(`/admin/users/${id}`);
    toast.success("User deleted");
    fetchUsers();
  } catch (error) {
    toast.error(error.response?.data?.message || "Couldn't delete that user.");
  }
};
  const createBreakingNews = async (e) => {
    e.preventDefault();

    if (!breakingForm.title.trim()) return;

    try {
      await api.post("/breaking-news/create", breakingForm);

      setBreakingForm({
        title: "",
        link: "",
        active: true,
      });

      fetchBreakingNews();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleBreakingNews = async (id) => {
    try {
      await api.patch(`/breaking-news/toggle/${id}`);

      fetchBreakingNews();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBreakingNews = async (id) => {
    try {
      await api.delete(`/breaking-news/delete/${id}`);

      fetchBreakingNews();
    } catch (error) {
      console.log(error);
    }
  };
const handleApprove = async (id) => {
  try {
    await approveNews(id);
    fetchPendingNews();
    fetchAnalytics();
  } catch (error) {
    console.log(error);
  }
};
const handleReject = async (id) => {
  try {
    await rejectNews(id);
    fetchPendingNews();
    fetchAnalytics();
  } catch (error) {
    console.log(error);
  }
};
  return (
    <div className="admin-dashboard">
      <h1>📊 Admin Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>📰 Total News</h2>
          <p>{analytics.totalNews}</p>
        </div>

        <div className="dashboard-card">
          <h2>👥 Total Users</h2>
          <p>{analytics.totalUsers}</p>
        </div>

        <div className="dashboard-card">
          <h2>💬 Total Comments</h2>
          <p>{analytics.totalComments}</p>
        </div>

        <div className="dashboard-card">
          <h2>➕ Create News</h2>

          <button
            onClick={() =>
              navigate("/create-news")
            }
          >
            Create
          </button>
        </div>

        <div className="dashboard-card">
          <h2>✏️ Manage News</h2>

          <button
            onClick={() =>
              navigate("/manage-news")
            }
          >
            Manage
          </button>
        </div>
      </div>
<div className="panel">
  <h2>📰 Pending News Approval</h2>

  {pendingNews.length === 0 ? (
    <p
      style={{
        marginTop: "20px",
      }}
    >
      No Pending News 🎉
    </p>
  ) : (
    pendingNews.map((news) => (
   <div
    key={news.id}
    className="pending-card"
>
       <div className="pending-left">
          <h3>{news.title}</h3>

          <p>{news.author}</p>

          <small>
            {news.category}
          </small>
        </div>

       <div className="pending-actions">
       <button
className="approve-btn"
onClick={()=>handleApprove(news.id)}
>
            ✅ Approve
          </button>

         <button
className="reject-btn"
onClick={()=>handleReject(news.id)}
>
            ❌ Reject
          </button>

        </div>
      </div>
    ))
  )}
</div>
      {/* Breaking News Section */}

    <div className="panel">
        <h2>🚨 Breaking News Management</h2>

    <form
className="breaking-form"
onSubmit={createBreakingNews}
>
          <input
            type="text"
            placeholder="Breaking News Title"
            value={breakingForm.title}
            onChange={(e) =>
              setBreakingForm({
                ...breakingForm,
                title: e.target.value,
              })
            }
          />

          <input
            type="text"
            placeholder="Optional Link"
            value={breakingForm.link}
            onChange={(e) =>
              setBreakingForm({
                ...breakingForm,
                link: e.target.value,
              })
            }
          />

          <button type="submit">
            Add Breaking News
          </button>
        </form>

       <div className="breaking-list">
          {breakingNews.length === 0 ? (
            <p>No Breaking News Found</p>
          ) : (
            breakingNews.map((item) => (
            <div
key={item.id}
className="breaking-item"
>
               <span className="breaking-title">
                  {item.title}
                </span>

               <div className="breaking-actions">
                  <button
                    onClick={() =>
                      toggleBreakingNews(
                        item.id
                      )
                    }
                  >
                    {item.active
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                <button
className="delete-btn"
onClick={()=>deleteBreakingNews(item.id)}
>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="panel">
        <h2>👥 User Management</h2>

        {users.length === 0 ? (
          <p style={{ marginTop: "20px" }}>No users found</p>
        ) : (
          <div className="news-table-wrapper">
            <table className="news-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className="category-badge">{u.role}</span>
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDeleteUser(u.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;