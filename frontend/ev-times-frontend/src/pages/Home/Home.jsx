import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import HeroSection from "../../components/HeroSection/HeroSection";
import NewsCard from "../../components/NewsCard/NewsCard";
import LiveTicker from "../../components/LiveTicker/LiveTicker";
import FilterBar from "../../components/FilterBar/FilterBar";
import { NewsCardSkeletonGrid } from "../../components/Skeleton/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import Footer from "../../components/Footer/Footer";
import Newsletter from "../../components/Newsletter/Newsletter";
import Categories from "../../components/Categories/Categories";
import FeaturedArticle from "../../components/FeaturedArticle/FeaturedArticle";
import MostRead from "../../components/MostRead/MostRead";
import TopHeadlines from "../../components/TopHeadlines/TopHeadlines";
import MostPopular from "../../components/MostPopular/MostPopular";
import VideoSection from "../../components/Videos/VideoSection";
import BlogSection from "../../components/BlogSection/BlogSection";
import BackToTop from "../../components/BackToTop/BackToTop";
import FloatingAIButton from "../../components/FloatingAIButton/FloatingAIButton";
import AIChat from "../../components/AIChat/AIChat";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import { useToast } from "../../context/ToastContext";
import { getAllNews, getNewsByState, getActiveBreakingNews } from "../../services/newsService";
import { FaSatelliteDish } from "react-icons/fa";
import "./Home.css";

const PAGE_SIZE = 12;

const Home = () => {
  const toast = useToast();

  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [breakingNews, setBreakingNews] = useState([]);
  const [selectedState, setSelectedState] = useState(
    localStorage.getItem("selectedState") || "All States"
  );
  const [filters, setFilters] = useState({ category: "All", date: "all", source: "all" });
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Navbar's state dropdown dispatches this instead of a hard reload.
  useEffect(() => {
    const onStateChange = () => setSelectedState(localStorage.getItem("selectedState") || "All States");
    window.addEventListener("ev-state-change", onStateChange);
    return () => window.removeEventListener("ev-state-change", onStateChange);
  }, []);

  const fetchPage = useCallback(
    async (targetPage, replace) => {
      replace ? setLoading(true) : setLoadingMore(true);
      try {
        const response =
          selectedState === "All States"
            ? await getAllNews(targetPage, PAGE_SIZE, "id", "desc")
            : await getNewsByState(selectedState, targetPage, PAGE_SIZE);

        const content = response.data.content || [];
        setNews((prev) => (replace ? content : [...prev, ...content]));
        setTotalPages(response.data.totalPages ?? 1);
        setPage(targetPage);
      } catch {
        toast.error("Couldn't load news right now. Pull to refresh in a moment.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedState] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    fetchPage(0, true);
    getActiveBreakingNews()
      .then((res) => setBreakingNews(res.data || []))
      .catch(() => setBreakingNews([]));
  }, [selectedState]); // eslint-disable-line react-hooks/exhaustive-deps

  const hasMore = page + 1 < totalPages;
  const sentinelRef = useInfiniteScroll(
    () => !loading && !loadingMore && hasMore && fetchPage(page + 1, false),
    hasMore
  );

  const categories = useMemo(
    () => [...new Set(news.map((n) => n.category).filter(Boolean))],
    [news]
  );
  const sources = useMemo(
    () => [...new Set(news.map((n) => n.source).filter(Boolean))],
    [news]
  );

  const withinDateFilter = (item) => {
    if (filters.date === "all") return true;
    const published = new Date(item.publishedAt || item.createdAt);
    if (Number.isNaN(published.getTime())) return true;
    const days = { "24h": 1, "7d": 7, "30d": 30 }[filters.date];
    return (Date.now() - published.getTime()) / 86400000 <= days;
  };

  const filteredNews = news.filter((item) => {
    const matchesCategory = filters.category === "All" || item.category === filters.category;
    const matchesSource = filters.source === "all" || item.source === filters.source;
    return matchesCategory && matchesSource && withinDateFilter(item);
  });

  const heroArticle = news[0];
  const trending = news.slice(1, 7);

  return (
    <>
      <LiveTicker items={breakingNews} />
      <HeroSection news={heroArticle} loading={loading} />

      {trending.length > 0 && (
        <section className="container trending-rail">
          <div className="rail-header">
            <FaSatelliteDish />
            <h2 className="section-title">Trending now</h2>
          </div>
          <div className="rail-scroll">
            {trending.map((item) => (
              <div className="rail-item" key={item.id}>
                <NewsCard article={item} variant="compact" />
              </div>
            ))}
          </div>
        </section>
      )}

      <FeaturedArticle news={news[7]} />
      <MostRead news={news} />
      <TopHeadlines news={news} />
      <VideoSection />
      <BlogSection />

      <section id="trending-news" className="container news-section">
        <div className="section-header">
          <h2 className="section-title">Latest EV News</h2>
        </div>

        <FilterBar
          categories={categories}
          sources={sources}
          filters={filters}
          onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        />

        {loading ? (
          <NewsCardSkeletonGrid count={9} />
        ) : filteredNews.length === 0 ? (
          <EmptyState
            title="Nothing here yet"
            description="Try a different category, date range, or check back once new stories come in."
          />
        ) : (
          <motion.div
            className="news-grid"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.04 } } }}
          >
            {filteredNews.map((item) => (
              <motion.div
                key={item.id}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              >
                <NewsCard article={item} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
        {loadingMore && <NewsCardSkeletonGrid count={3} />}
        {!hasMore && !loading && filteredNews.length > 0 && (
          <p className="end-of-feed">You're all caught up ⚡</p>
        )}
      </section>

      <MostPopular news={news} />
      <Categories
        selectedCategory={filters.category}
        setSelectedCategory={(category) => setFilters((f) => ({ ...f, category }))}
      />
      <Newsletter />
      <BackToTop />
      <FloatingAIButton onClick={() => setIsChatOpen(true)} />
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <Footer />
    </>
  );
};

export default Home;
