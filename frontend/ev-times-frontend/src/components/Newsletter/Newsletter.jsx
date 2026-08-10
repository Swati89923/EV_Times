import { useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import "./Newsletter.css";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const subscribe = async () => {
    if (!email.trim()) {
      toast.info("Enter your email to subscribe");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/newsletter/subscribe", { email });
      toast.success(response.data || "Subscribed successfully");
      setEmail("");
    } catch {
      toast.error("Subscription failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter">

      <h2>📧 EV Newsletter</h2>

      <p>
        Get the latest EV news and updates directly in your inbox.
      </p>

      <div className="newsletter-box">

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          onKeyDown={(e) => e.key === "Enter" && subscribe()}
        />

        <button onClick={subscribe} disabled={loading}>
          {loading ? "Subscribing…" : "Subscribe"}
        </button>

      </div>

    </section>
  );
};

export default Newsletter;
