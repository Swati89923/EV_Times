import "./LiveTicker.css";

/**
 * Reads like a live instrument readout: a pulsing "LIVE" indicator
 * plus a scrolling strip of breaking headlines, set in mono type
 * like a dashboard display. This is the site's one signature motion
 * moment — everything else stays quiet.
 */
const LiveTicker = ({ items = [] }) => {
  if (!items.length) return null;

  // duplicate the list so the CSS marquee loops seamlessly
  const loopItems = [...items, ...items];

  return (
    <div className="live-ticker" role="marquee" aria-label="Breaking EV news">
      <div className="live-ticker-label">
        <span className="live-dot" aria-hidden="true" />
        LIVE&nbsp;CURRENT
      </div>
      <div className="live-ticker-track">
        <div className="live-ticker-scroll">
          {loopItems.map((item, i) => (
            <a
              key={`${item.id}-${i}`}
              href={item.url || `/news/${item.id}`}
              target={item.url ? "_blank" : undefined}
              rel={item.url ? "noreferrer" : undefined}
              className="live-ticker-item"
            >
              {item.title}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTicker;
