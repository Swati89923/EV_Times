import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FaRegBookmark,
  FaBookmark,
  FaWhatsapp,
  FaLinkedinIn,
  FaXTwitter,
  FaLink,
  FaRegClock,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa6";

import VoiceReader from "../components/VoiceReader/VoiceReader";
import AISummary from "../components/AISummary/AISummary";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { HeroSkeleton, NewsCardSkeleton } from "../components/Skeleton/Skeleton";
import NewsCard from "../components/NewsCard/NewsCard";

import { getNewsById, getNewsByCategory, getAllNews } from "../services/newsService";
import { getComments, postComment, deleteComment as deleteCommentApi } from "../services/commentService";
import { useToast } from "../context/ToastContext";
import { toggleBookmark, isBookmarked, pushNotification } from "../utils/storage";
import { resolveImage, readTime, timeAgo } from "../utils/news";
import "./NewsDetails.css";

const NewsDetails = () => {
  const { id } = useParams();
  const toast = useToast();

  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [siblingNews, setSiblingNews] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    (async () => {
      try {
        const { data: article } = await getNewsById(id);
        if (cancelled) return;
        setNews(article);
        setBookmarked(isBookmarked(article.id));

        const [{ data: related }, { data: latestPage }, { data: commentData }] = await Promise.all([
          getNewsByCategory(article.category).catch(() => ({ data: [] })),
          getAllNews(0, 6, "id", "desc").catch(() => ({ data: { content: [] } })),
          getComments(id).catch(() => ({ data: [] })),
        ]);
        if (cancelled) return;

        setSiblingNews(latestPage.content || []);
        setLatestNews((latestPage.content || []).filter((n) => n.id !== article.id).slice(0, 5));

        const shuffled = (related || [])
          .filter((n) => n.id !== article.id)
          .sort(() => 0.5 - Math.random());
        setRelatedNews(shuffled.slice(0, 3));
        setComments(commentData || []);
      } catch {
        if (!cancelled) toast.error("Couldn't load that article.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard");
  };

  const handleBookmark = () => {
    const added = toggleBookmark(news);
    setBookmarked(added);
    toast.success(added ? "Saved to bookmarks" : "Removed from bookmarks");
    if (added) pushNotification(`🔖 Saved: ${news.title}`);
  };

  const submitComment = async () => {
    const email = localStorage.getItem("ev_email");
    if (!email) {
      toast.info("Log in to join the discussion");
      return;
    }
    if (!commentText.trim()) return;

    try {
      await postComment(id, { message: commentText });
      setCommentText("");
      const { data } = await getComments(id);
      setComments(data || []);
      pushNotification("💬 New comment posted");
      toast.success("Comment posted");
    } catch {
      toast.error("Couldn't post your comment. Try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteCommentApi(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Couldn't delete that comment.");
    }
  };

  const currentIndex = useMemo(
    () => siblingNews.findIndex((item) => item.id === news?.id),
    [siblingNews, news]
  );
  const previousArticle = currentIndex > 0 ? siblingNews[currentIndex - 1] : null;
  const nextArticle =
    currentIndex >= 0 && currentIndex < siblingNews.length - 1 ? siblingNews[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="container article-page">
        <HeroSkeleton />
        <div style={{ marginTop: 24, display: "grid", gap: 12 }}>
          <NewsCardSkeleton />
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="container">
        <EmptyState title="Article not found" description="It may have been removed or the link is incorrect." />
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="article-banner">
        <img src={resolveImage(news.imageUrl)} alt={news.title} />
        <div className="article-banner-scrim" />
      </div>

      <div className="container article-layout">
        <article className="article-main">
          <div className="article-tags">
            <Badge tone="amber">{news.category}</Badge>
          </div>

          <h1 className="article-title">{news.title}</h1>

          <div className="article-meta">
            <span>✍️ {news.author || "EV Times"}</span>
            <span className="meta-dot">·</span>
            <span><FaRegClock /> {readTime(news.description)} min read</span>
            <span className="meta-dot">·</span>
            <span>{timeAgo(news.publishedAt || news.createdAt)}</span>
          </div>

          <AISummary article={news.description} />

          <div className="article-toolbar">
            <VoiceReader title={news.title} description={news.description} />
            <Button
              variant={bookmarked ? "primary" : "secondary"}
              size="sm"
              icon={bookmarked ? <FaBookmark /> : <FaRegBookmark />}
              onClick={handleBookmark}
            >
              {bookmarked ? "Saved" : "Save"}
            </Button>
          </div>

          <div className="article-body">
            <p>{news.description}</p>
          </div>

          {news.url && (
            <a href={news.url} target="_blank" rel="noopener noreferrer" className="original-link">
              Read the original source →
            </a>
          )}

          <div className="share-row">
            <span className="eyebrow">Share this story</span>
            <div className="share-buttons">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(news.title + " " + shareUrl)}`}
                target="_blank" rel="noreferrer" className="share-btn" aria-label="Share on WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noreferrer" className="share-btn" aria-label="Share on LinkedIn"
              >
                <FaLinkedinIn />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank" rel="noreferrer" className="share-btn" aria-label="Share on X"
              >
                <FaXTwitter />
              </a>
              <button onClick={copyLink} className="share-btn" aria-label="Copy link">
                <FaLink />
              </button>
            </div>
          </div>

          <nav className="article-nav">
            {previousArticle ? (
              <Link to={`/news/${previousArticle.id}`} className="article-nav-btn prev">
                <FaChevronLeft /> <span>{previousArticle.title}</span>
              </Link>
            ) : <span />}
            {nextArticle && (
              <Link to={`/news/${nextArticle.id}`} className="article-nav-btn next">
                <span>{nextArticle.title}</span> <FaChevronRight />
              </Link>
            )}
          </nav>

          <section className="comments-section">
            <div className="comment-header">
              <h2>{comments.length} Comments</h2>
              <p>Join the EV community discussion</p>
            </div>

            {!localStorage.getItem("ev_email") && (
              <div className="login-reminder">
                <Link to="/login">Log in</Link> to join the discussion.
              </div>
            )}

            <div className="comment-form">
              <textarea
                placeholder="Write your comment…"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button onClick={submitComment} size="sm">Post comment</Button>
            </div>

            <div className="comments-list">
              {comments.length === 0 ? (
                <EmptyState title="No comments yet" description="Be the first to weigh in." />
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-top">
                      <div className="comment-avatar">{comment.userEmail?.charAt(0).toUpperCase()}</div>
                      <div>
                        <h4>{comment.userEmail}</h4>
                        <small>{new Date(comment.createdAt).toLocaleString()}</small>
                      </div>
                      <button className="comment-delete" onClick={() => handleDeleteComment(comment.id)} aria-label="Delete comment">
                        <FaTrash />
                      </button>
                    </div>
                    <p>{comment.message}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          {relatedNews.length > 0 && (
            <section className="related-section">
              <h2 className="section-title">Related articles</h2>
              <div className="related-grid">
                {relatedNews.map((item) => (
                  <NewsCard key={item.id} article={item} />
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className="article-sidebar">
          <div className="sidebar-block">
            <h3 className="eyebrow">Latest</h3>
            <div className="sidebar-list">
              {latestNews.map((item) => (
                <NewsCard key={item.id} article={item} variant="compact" />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NewsDetails;
