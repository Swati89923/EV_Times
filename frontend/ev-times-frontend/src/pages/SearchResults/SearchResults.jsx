import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import NewsCard from "../../components/NewsCard/NewsCard";
import FilterBar from "../../components/FilterBar/FilterBar";
import { NewsCardSkeletonGrid } from "../../components/Skeleton/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import { searchNews } from "../../services/newsService";
import "./SearchResults.css";

const SearchResults = () => {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "All", date: "all", source: "all" });

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchNews(query)
      .then((res) => !cancelled && setResults(res.data || []))
      .catch(() => !cancelled && setResults([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [query]);

  const categories = useMemo(
    () => [...new Set(results.map((n) => n.category).filter(Boolean))],
    [results]
  );
  const sources = useMemo(
    () => [...new Set(results.map((n) => n.source).filter(Boolean))],
    [results]
  );

  const filtered = results.filter((item) => {
    const matchesCategory = filters.category === "All" || item.category === filters.category;
    const matchesSource = filters.source === "all" || item.source === filters.source;
    return matchesCategory && matchesSource;
  });

  return (
    <div className="container search-results-page">
      <div className="search-results-header">
        <FaSearch />
        <h1>
          {query ? (
            <>Results for “{query}”</>
          ) : (
            "Search EV Times"
          )}
        </h1>
      </div>

      {query && !loading && (
        <p className="search-results-count">
          {filtered.length} {filtered.length === 1 ? "story" : "stories"} found
        </p>
      )}

      {query && results.length > 0 && (
        <FilterBar
          categories={categories}
          sources={sources}
          filters={filters}
          onChange={(patch) => setFilters((f) => ({ ...f, ...patch }))}
        />
      )}

      {loading ? (
        <NewsCardSkeletonGrid count={6} />
      ) : !query.trim() ? (
        <EmptyState
          title="Type something to search"
          description="Search by headline, brand, or topic — for example “battery swap” or “Tata”."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No results"
          description={`We couldn't find anything matching “${query}”. Try a broader term.`}
        />
      ) : (
        <div className="search-results-grid">
          {filtered.map((item) => (
            <NewsCard key={item.id} article={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
