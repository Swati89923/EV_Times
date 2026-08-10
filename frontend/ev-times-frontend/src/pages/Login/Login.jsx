import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import "./Login.css";

function Login() {

  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await API.post("/login", formData);

      // Goes through AuthContext instead of writing to localStorage
      // directly, so every component reading auth state (Navbar, in
      // particular) re-renders immediately instead of staying stale
      // until some unrelated re-render happens to pick up the change.
      login(response.data);

      toast.success("Welcome back!");
      navigate("/");

    } catch {
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h2>Login</h2>

        <form
          onSubmit={handleSubmit}
          className="login-form"
        >

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Logging in…" : "Login"}
          </button>

        </form>

        <div className="login-footer">
          Don't have an account?{" "}
          <Link to="/signup">
            Signup
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Login;
