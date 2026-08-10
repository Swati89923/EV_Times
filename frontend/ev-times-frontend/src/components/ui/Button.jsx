import "./ui.css";

/**
 * variant: "primary" | "secondary" | "ghost" | "danger"
 * size: "sm" | "md"
 */
const Button = ({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}) => (
  <button className={`btn btn-${variant} btn-${size} ${className}`} {...rest}>
    {icon && <span className="btn-icon">{icon}</span>}
    {children}
  </button>
);

export default Button;
