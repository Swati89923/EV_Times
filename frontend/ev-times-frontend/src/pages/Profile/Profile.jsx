import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
const Profile = () => {
const navigate = useNavigate();
const email =
    localStorage.getItem("ev_email");
const role =
    localStorage.getItem("ev_role");
const bookmarks =
    JSON.parse(
      localStorage.getItem("bookmarks")
    ) || [];
const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
  {/* NEW */}
  <div className="avatar">
    {email
      ? email.charAt(0).toUpperCase()
      : "S"}
  </div>
  {/* NEW */}
  <div className="profile-info">
    <h1>Welcome Back</h1>
    <h3 className="profile-email">
      {email}
    </h3>
    <p className="profile-role">
      👑 {role}
    </p>
 </div>
</div>
        <div className="profile-stats">
         <div className="stat-box">
            <h3>{bookmarks.length}</h3>
            <p>Saved Articles</p>
          </div>
          <div className="stat-box">
            <h3>Active</h3>
            <p>Login Status</p>
          </div>
          </div>
        <div className="quick-actions">
          <h2>⚡ Quick Actions</h2>
          <div className="action-buttons">
            <Link
              to="/bookmarks"
              className="action-btn"
            >
              🔖 Bookmarks
            </Link>
            <Link
              to="/"
              className="action-btn"
            >
              🏠 Home
            </Link>
            {role === "ADMIN" && (
              <Link
                to="/create-news"
                className="action-btn"
              >
                ➕ Create News
              </Link>
            )}
          </div>
        </div>
        <div className="recent-bookmarks">
          <h2>📚 Recent Bookmarks</h2>
          {bookmarks.length > 0 ? (
              bookmarks
              .slice(-3)
              .reverse()
              .map((article) => (
              <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="bookmark-item"
                >
                  🔖 {article.title}
                </Link>
                 ))
            ) : (
            <p>No saved articles</p>
          )}
        </div>
        <button
          className="logout-profile-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};
export default Profile;