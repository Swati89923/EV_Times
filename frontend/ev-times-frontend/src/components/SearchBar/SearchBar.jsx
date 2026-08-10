import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaTimes, FaHistory, FaMicrophone } from "react-icons/fa";
import useDebounce from "../../hooks/useDebounce";
import { searchNews } from "../../services/newsService";
import { addRecentSearch, clearRecentSearches, getRecentSearches } from "../../utils/storage";
import { useToast } from "../../context/ToastContext";
import "./SearchBar.css";

const SpeechRecognitionAPI =
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

/**
 * Standalone search input with a suggestions dropdown. On submit,
 * navigates to /search?q=... so results are a shareable, bookmarkable
 * URL rather than only living in Home's local state.
 */
const SearchBar = ({ autoFocus = false, onClose, className = "" }) => {
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [recent, setRecent] = useState(getRecentSearches());
  const debouncedTerm = useDebounce(term, 300);
  const containerRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  const startVoiceSearch = () => {
    if (!SpeechRecognitionAPI) {
      toast.info("Voice search isn't supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onerror = () => {
      setListening(false);
      toast.error("Couldn't hear that — try again");
    };
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const heard = event.results[0][0].transcript;
      setTerm(heard);
      setOpen(true);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceSearch = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  useEffect(() => {
    if (!debouncedTerm.trim()) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    searchNews(debouncedTerm)
      .then((res) => {
        if (!cancelled) setSuggestions((res.data || []).slice(0, 6));
      })
      .catch(() => !cancelled && setSuggestions([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [debouncedTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const runSearch = (value) => {
    const q = value.trim();
    if (!q) return;
    setRecent(addRecentSearch(q));
    setOpen(false);
    onClose?.();
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className={`search-bar ${className}`} ref={containerRef}>
      <div className="search-bar-input">
        <FaSearch className="search-bar-icon" />
        <input
          type="text"
          autoFocus={autoFocus}
          placeholder="Search EV news, brands, topics…"
          value={term}
          onFocus={() => setOpen(true)}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch(term)}
          aria-label="Search EV news"
        />
        {term && (
          <button
            className="search-bar-clear"
            onClick={() => setTerm("")}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
        {SpeechRecognitionAPI && (
          <button
            type="button"
            className={`search-bar-mic ${listening ? "is-listening" : ""}`}
            onClick={listening ? stopVoiceSearch : startVoiceSearch}
            aria-label={listening ? "Stop voice search" : "Search by voice"}
            aria-pressed={listening}
          >
            <FaMicrophone />
          </button>
        )}
      </div>

      {open && (
        <div className="search-dropdown">
          {term.trim() ? (
            <>
              {loading && <div className="search-dropdown-status">Searching…</div>}
              {!loading && suggestions.length === 0 && (
                <div className="search-dropdown-status">No matches for “{term}”</div>
              )}
              {suggestions.map((item) => (
                <button
                  key={item.id}
                  className="search-suggestion"
                  onClick={() => {
                    setOpen(false);
                    onClose?.();
                    setRecent(addRecentSearch(term));
                    navigate(`/news/${item.id}`);
                  }}
                >
                  <FaSearch className="search-suggestion-icon" />
                  <span>{item.title}</span>
                  {item.category && <span className="search-suggestion-tag">{item.category}</span>}
                </button>
              ))}
            </>
          ) : (
            recent.length > 0 && (
              <div className="search-recent">
                <div className="search-recent-header">
                  <span>Recent searches</span>
                  <button
                    onClick={() => {
                      clearRecentSearches();
                      setRecent([]);
                    }}
                  >
                    Clear
                  </button>
                </div>
                {recent.map((r) => (
                  <button key={r} className="search-suggestion" onClick={() => runSearch(r)}>
                    <FaHistory className="search-suggestion-icon" />
                    <span>{r}</span>
                  </button>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
