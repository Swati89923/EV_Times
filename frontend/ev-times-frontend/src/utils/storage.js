// Centralized localStorage helpers. Keeping all key names and
// parse/stringify logic in one place avoids the copy-pasted
// JSON.parse(localStorage.getItem(...)) || [] pattern.

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ---------------- Bookmarks ---------------- */
const BOOKMARKS_KEY = "bookmarks";

export const getBookmarks = () => readJSON(BOOKMARKS_KEY, []);

export const isBookmarked = (id) => getBookmarks().some((a) => a.id === id);

export const toggleBookmark = (article) => {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some((a) => a.id === article.id);
  const next = exists
    ? bookmarks.filter((a) => a.id !== article.id)
    : [...bookmarks, article];
  writeJSON(BOOKMARKS_KEY, next);
  window.dispatchEvent(new Event("ev-bookmarks-change"));
  return !exists; // true if it was just added
};

export const removeBookmark = (id) => {
  writeJSON(BOOKMARKS_KEY, getBookmarks().filter((a) => a.id !== id));
};

/* ---------------- Likes ---------------- */
const LIKES_KEY = "liked_articles";

export const getLikedIds = () => readJSON(LIKES_KEY, []);

export const isLiked = (id) => getLikedIds().includes(id);

export const toggleLike = (id) => {
  const liked = getLikedIds();
  const exists = liked.includes(id);
  const next = exists ? liked.filter((x) => x !== id) : [...liked, id];
  writeJSON(LIKES_KEY, next);
  return !exists;
};

/* ---------------- Recent searches ---------------- */
const RECENT_SEARCHES_KEY = "recent_searches";
const MAX_RECENT = 8;

export const getRecentSearches = () => readJSON(RECENT_SEARCHES_KEY, []);

export const addRecentSearch = (term) => {
  const trimmed = term.trim();
  if (!trimmed) return getRecentSearches();
  const existing = getRecentSearches().filter(
    (t) => t.toLowerCase() !== trimmed.toLowerCase()
  );
  const next = [trimmed, ...existing].slice(0, MAX_RECENT);
  writeJSON(RECENT_SEARCHES_KEY, next);
  return next;
};

export const clearRecentSearches = () => writeJSON(RECENT_SEARCHES_KEY, []);

/* ---------------- Notifications (used by Navbar bell) ---------------- */
const NOTIFICATIONS_KEY = "notifications";

export const getNotifications = () => readJSON(NOTIFICATIONS_KEY, []);

export const pushNotification = (message) => {
  const next = [message, ...getNotifications()].slice(0, 30);
  writeJSON(NOTIFICATIONS_KEY, next);
  return next;
};
