import "./FilterBar.css";

const DATE_OPTIONS = [
  { value: "all", label: "Any time" },
  { value: "24h", label: "Past 24 hours" },
  { value: "7d", label: "Past week" },
  { value: "30d", label: "Past month" },
];

/**
 * filters: { category, date, source }
 * onChange(patch) merges a partial update into the parent's filter state.
 */
const FilterBar = ({ categories = [], sources = [], filters, onChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-bar-categories" role="tablist" aria-label="Filter by category">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={filters.category === cat}
            className={`filter-pill ${filters.category === cat ? "is-active" : ""}`}
            onClick={() => onChange({ category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filter-bar-selects">
        <select
          className="filter-select"
          value={filters.date}
          onChange={(e) => onChange({ date: e.target.value })}
          aria-label="Filter by date"
        >
          {DATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {sources.length > 0 && (
          <select
            className="filter-select"
            value={filters.source}
            onChange={(e) => onChange({ source: e.target.value })}
            aria-label="Filter by source"
          >
            <option value="all">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
