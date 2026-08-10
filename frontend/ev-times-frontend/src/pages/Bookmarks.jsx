import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import NewsCard from "../components/NewsCard/NewsCard";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
import { getBookmarks } from "../utils/storage";
import "./Bookmarks.css";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
    const onChange = () => setBookmarks(getBookmarks());
    window.addEventListener("ev-bookmarks-change", onChange);
    return () => window.removeEventListener("ev-bookmarks-change", onChange);
  }, []);

  return (
    <div className="container bookmarks-page">
      <div className="bookmarks-header">
        <h1><FaBookmark /> Saved articles</h1>
        <p>Everything you've bookmarked, kept on this device.</p>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          title="No saved articles yet"
          description="Tap the bookmark icon on any story to save it here for later."
          action={
            <Link to="/">
              <Button variant="primary" size="sm">Browse the latest news</Button>
            </Link>
          }
        />
      ) : (
        <div className="bookmarks-grid">
          {bookmarks.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
