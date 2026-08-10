import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import Badge from "../ui/Badge";
import { resolveImage, readTime, timeAgo, truncate } from "../../utils/news";
import { HeroSkeleton } from "../Skeleton/Skeleton";
import "./HeroSection.css";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const HeroSection = ({ news, loading }) => {
  if (loading) return <HeroSkeleton />;
  if (!news) return null;

  return (
    <section className="hero">
      <Link to={`/news/${news.id}`} className="hero-media">
        <img src={resolveImage(news.imageUrl)} alt={news.title} />
        <div className="hero-scrim" />
      </Link>

      <motion.div className="hero-overlay" variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="hero-tags">
          <Badge tone="danger">⚡ Top story</Badge>
          {news.category && <Badge tone="neutral">{news.category}</Badge>}
        </motion.div>

        <motion.h1 variants={item}>
          <Link to={`/news/${news.id}`}>{truncate(news.title, 110)}</Link>
        </motion.h1>

        <motion.p variants={item} className="hero-desc">
          {truncate(news.description, 190)}
        </motion.p>

        <motion.div variants={item} className="hero-meta">
          <span>{news.author || "EV Times"}</span>
          <span className="hero-dot">·</span>
          <span>{readTime(news.description)} min read</span>
          <span className="hero-dot">·</span>
          <span>{timeAgo(news.publishedAt || news.createdAt)}</span>
        </motion.div>

        <motion.div variants={item}>
          <Link to={`/news/${news.id}`} className="hero-cta">
            Read the full story <FaArrowRight />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
