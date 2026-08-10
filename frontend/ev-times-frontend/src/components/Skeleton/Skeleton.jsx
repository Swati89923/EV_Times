import "./Skeleton.css";

/**
 * Generic shimmer block. Compose with width/height/radius props
 * for any shape (text line, thumbnail, avatar, etc).
 */
export const Skeleton = ({ width = "100%", height = "16px", radius = "6px", style = {} }) => (
  <span
    className="skeleton"
    style={{ width, height, borderRadius: radius, ...style }}
    aria-hidden="true"
  />
);

/** Skeleton matching the NewsCard layout, for grid loading states. */
export const NewsCardSkeleton = () => (
  <div className="news-card-skeleton">
    <Skeleton height="180px" radius="var(--radius-md)" />
    <div className="news-card-skeleton-body">
      <Skeleton width="70px" height="12px" />
      <Skeleton height="18px" />
      <Skeleton width="85%" height="18px" />
      <Skeleton width="40%" height="12px" />
    </div>
  </div>
);

/** Skeleton matching the hero layout. */
export const HeroSkeleton = () => (
  <div className="hero-skeleton">
    <Skeleton height="100%" radius="var(--radius-lg)" />
  </div>
);

export const NewsCardSkeletonGrid = ({ count = 6 }) => (
  <div className="skeleton-grid">
    {Array.from({ length: count }).map((_, i) => (
      <NewsCardSkeleton key={i} />
    ))}
  </div>
);

export default Skeleton;
