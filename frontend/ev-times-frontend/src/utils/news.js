const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop";

export function resolveImage(url) {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith("http")) return url;
  return `${API_BASE}/uploads/${url}`;
}

export function readTime(text) {
  const words = text?.trim()?.split(/\s+/).filter(Boolean).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function timeAgo(dateInput) {
  if (!dateInput) return "Recently";
  const published = new Date(dateInput);
  if (Number.isNaN(published.getTime())) return "Recently";

  const diffSeconds = Math.floor((Date.now() - published.getTime()) / 1000);
  if (diffSeconds < 60) return "Just now";

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return published.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function truncate(text, max) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export { API_BASE };
