import { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { summarizeArticle } from "../../services/aiService";
import { useToast } from "../../context/ToastContext";
import "./AISummary.css";

const AISummary = ({ article }) => {
  const toast = useToast();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!article) return;
    try {
      setLoading(true);
      const res = await summarizeArticle(article);
      setSummary(res.data);
    } catch {
      toast.error("Couldn't generate a summary right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-summary">
      {!summary && !loading && (
        <button className="ai-summary-trigger" onClick={generate}>
          <FaWandMagicSparkles /> AI summary
        </button>
      )}

      {loading && (
        <div className="ai-summary-card ai-summary-loading">
          <FaWandMagicSparkles className="ai-summary-icon spin" />
          Summarizing…
        </div>
      )}

      {summary && !loading && (
        <div className="ai-summary-card">
          <div className="ai-summary-header">
            <FaWandMagicSparkles className="ai-summary-icon" />
            <span>AI summary</span>
          </div>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default AISummary;
