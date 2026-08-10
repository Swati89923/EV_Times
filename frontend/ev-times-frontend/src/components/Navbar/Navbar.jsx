import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBolt, FaBell, FaSun, FaMoon, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import SearchBar from "../SearchBar/SearchBar";
import { getNotifications } from "../../utils/storage";
import "./Navbar.css";

const STATES = [
  "All States", "Delhi", "Maharashtra", "Uttar Pradesh", "Gujarat", "Punjab",
  "Haryana", "Rajasthan", "Bihar", "Jharkhand", "West Bengal", "Odisha",
  "Tamil Nadu", "Karnataka", "Kerala", "Telangana",
];

const Navbar = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const token = user?.token;
  const role = user?.role;

  useEffect(() => {
    setNotificationCount(getNotifications().length);
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleStateChange = (e) => {
    localStorage.setItem("selectedState", e.target.value);
    navigate("/");
    // Home listens for this via its own state read on mount / storage event.
    window.dispatchEvent(new Event("ev-state-change"));
  };

  const handleLogout = () => {
    logout();
    toast.info("Signed out");
    navigate("/login");
  };

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="logo">
          <FaBolt />
          <span>EV TIMES</span>
        </Link>

        <div className="navbar-search-desktop">
          <SearchBar />
        </div>

        <nav className="nav-links">
          <Link to="/" className="nav-link">Home</Link>

          {role === "ADMIN" && (
            <Link to="/admin" className="nav-link">Admin</Link>
          )}

          <select
            className="state-dropdown"
            defaultValue={localStorage.getItem("selectedState") || "All States"}
            onChange={handleStateChange}
            aria-label="Filter news by state"
          >
            {STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>

          {token && <Link to="/bookmarks" className="nav-link">Bookmarks</Link>}

          {!token ? (
            <div className="nav-auth">
              <Link to="/login" className="nav-link">Log in</Link>
              <Link to="/signup" className="nav-signup-btn">Sign up</Link>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/profile" className="nav-link">Profile</Link>
              <button onClick={handleLogout} className="nav-logout-btn">Log out</button>
            </div>
          )}

          <Link to="/notifications" className="icon-btn" aria-label="Notifications">
            <FaBell />
            {notificationCount > 0 && <span className="icon-badge">{notificationCount}</span>}
          </Link>

          <button
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
        </nav>

        <div className="navbar-mobile-actions">
          <button className="icon-btn" onClick={() => setSearchOpen((v) => !v)} aria-label="Search">
            <FaSearch />
          </button>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
          <button className="icon-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <FaBars />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="navbar-search-mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <SearchBar autoFocus onClose={() => setSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              className="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="icon-btn mobile-menu-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <FaTimes />
              </button>

              <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
              {role === "ADMIN" && <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>}
              {token && <Link to="/bookmarks" onClick={() => setMobileOpen(false)}>Bookmarks</Link>}
              {token && <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>}
              <Link to="/notifications" onClick={() => setMobileOpen(false)}>Notifications</Link>

              <select
                className="state-dropdown state-dropdown-mobile"
                defaultValue={localStorage.getItem("selectedState") || "All States"}
                onChange={(e) => {
                  handleStateChange(e);
                  setMobileOpen(false);
                }}
              >
                {STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              {!token ? (
                <div className="mobile-menu-auth">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>Log in</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}>Sign up</Link>
                </div>
              ) : (
                <button
                  className="nav-logout-btn"
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                >
                  Log out
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
