import { useEffect, useState } from "react";
import { getNotifications } from "../../utils/storage";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  const clearAll = () => {
    localStorage.setItem("notifications", JSON.stringify([]));
    setNotifications([]);
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>🔔 Notifications</h1>
        {notifications.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          title="No notifications yet"
          description="Bookmarks, new comments, and other activity will show up here."
        />
      ) : (
        notifications.map((item, index) => (
          <div
            key={index}
            className="notification-card"
          >
            {item}
          </div>
        ))
      )}
    </div>
  );
};

export default Notifications;
