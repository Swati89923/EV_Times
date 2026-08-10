import { useState } from "react";
import API from "../../services/api";
import "./Signup.css";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

function Signup() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: "",
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
      // The backend always assigns the "USER" role on signup regardless of
      // what's submitted here, so there's no role field to pick — every
      // account starts as a regular user.
      await API.post("/signup", formData);

      toast.success("Account created — log in to continue");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="signup-container">
    <div className="signup-card">
      <h2>Create Account</h2>

      <form
        onSubmit={handleSubmit}
        className="signup-form"
      >
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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
          minLength={6}
        />

        <button
          type="submit"
          className="signup-btn"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>

      <div className="signup-footer">
        Already have an account?{" "}
        <Link to="/login">
          Login
        </Link>
      </div>
    </div>
  </div>
);
}

export default Signup;
