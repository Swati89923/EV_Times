import "./ui.css";

/** tone: "amber" | "current" | "live" | "danger" | "neutral" */
const Badge = ({ tone = "neutral", children, className = "" }) => (
  <span className={`badge badge-${tone} ${className}`}>{children}</span>
);

export default Badge;
