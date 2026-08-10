import { useEffect, useRef } from "react";

/**
 * Calls `onIntersect` when the returned ref's element scrolls
 * into view — used as the sentinel at the bottom of a news list.
 *
 * @param {Function} onIntersect - called when sentinel becomes visible
 * @param {boolean} enabled - set false to pause (e.g. while loading, or no more pages)
 */
export default function useInfiniteScroll(onIntersect, enabled = true) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onIntersect);
  callbackRef.current = onIntersect;

  useEffect(() => {
    if (!enabled) return;
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callbackRef.current();
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  return sentinelRef;
}
