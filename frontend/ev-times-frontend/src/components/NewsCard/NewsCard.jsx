import { Link } from "react-router-dom";
import { useState, memo } from "react";
import { motion } from "framer-motion";
import { FaRegBookmark, FaBookmark, FaRegHeart, FaHeart, FaShareAlt, FaRegClock } from "react-icons/fa";
import Badge from "../ui/Badge";
import { useToast } from "../../context/ToastContext";
import { resolveImage, readTime, timeAgo, truncate } from "../../utils/news";
import { isBookmarked, isLiked, toggleBookmark, toggleLike } from "../../utils/storage";
import "./NewsCard.css";

/**
 * variant: "default" | "compact" | "featured"
 */
const NewsCard = ({ article, variant = "default" }) => {
  const toast = useToast();
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(article.id));
  const [liked, setLiked] = useState(() => isLiked(article.id));

  if (!article) return null;

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleBookmark(article);
    setBookmarked(added);
    toast.success(added ? "Saved to bookmarks" : "Removed from bookmarks");
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(toggleLike(article.id));
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/news/${article.id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
      } catch {
        /* user cancelled — no-op */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.info("Link copied to clipboard");
    }
  };

  return (
    <motion.article
      className={`news-card news-card--${variant}`}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/news/${article.id}`} className="news-card-link">
        <div className="news-card-media">
          <img
            src={resolveImage(article.imageUrl)}
            alt={article.title}
            loading="lazy"
            onError={(e) => {
              e.target.src = resolveImage(null);
            }}
          />
          {article.category && (
            <Badge tone="amber" className="news-card-category">
              {article.category}
            </Badge>
          )}
        </div>

        <div className="news-card-body">
          <h3>{truncate(article.title, variant === "compact" ? 70 : 100)}</h3>
          {variant !== "compact" && article.description && (
            <p className="news-card-desc">{truncate(article.description, 110)}</p>
          )}
          <div className="news-card-meta">
            <span className="news-card-time">
              <FaRegClock /> {readTime(article.description)} min read
            </span>
            <span className="news-card-dot">·</span>
            <span>{timeAgo(article.publishedAt || article.createdAt)}</span>
          </div>
        </div>
      </Link>

      <div className="news-card-actions">
        <button
          className={`news-card-action ${liked ? "is-active" : ""}`}
          onClick={handleLike}
          aria-pressed={liked}
          aria-label={liked ? "Unlike article" : "Like article"}
        >
          {liked ? <FaHeart /> : <FaRegHeart />}
        </button>
        <button
          className={`news-card-action ${bookmarked ? "is-active" : ""}`}
          onClick={handleBookmark}
          aria-pressed={bookmarked}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark article"}
        >
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
        <button className="news-card-action" onClick={handleShare} aria-label="Share article">
          <FaShareAlt />
        </button>
      </div>
    </motion.article>
  );
};

export default memo(NewsCard);
