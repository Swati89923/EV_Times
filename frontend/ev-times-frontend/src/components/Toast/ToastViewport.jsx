import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from "react-icons/fa";
import "./Toast.css";

const ICONS = {
  success: <FaCheckCircle />,
  error: <FaExclamationCircle />,
  info: <FaInfoCircle />,
};

const ToastViewport = ({ toasts, onDismiss }) => {
  return (
    <div className="toast-viewport" role="status" aria-live="polite">
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.16 } }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`toast toast-${t.type}`}
          >
            <span className="toast-icon">{ICONS[t.type]}</span>
            <span className="toast-message">{t.message}</span>
            <button
              className="toast-close"
              onClick={() => onDismiss(t.id)}
              aria-label="Dismiss notification"
            >
              <FaTimes />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastViewport;
