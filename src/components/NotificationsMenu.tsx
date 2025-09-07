import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiRequest";
import { FaBell as BellIcon, FaCheckCircle as MatchIcon, FaComments as ConversationIcon } from "react-icons/fa";

type NotificationDto = {
  id: number;
  message: string;
  type: "NEW_CONVERSATION" | "NEW_MATCH";
  referenceId: number;
  read: boolean;
  createdAt: string;
};

const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiRequest<NotificationDto[]>("/notifications");
        setNotifications(data);
      } catch (err) {
        console.error("Błąd przy pobieraniu powiadomień", err);
        setError(true);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        className="relative btn btn-ghost btn-circle"
        onClick={() => setOpen((prev) => !prev)}
      >
        <BellIcon className={`h-6 w-6 ${error ? "text-error" : "text-base-content"}`} />
        <span className="absolute -top-1 -right-1 badge badge-primary text-xs">
          {error ? "!" : unreadCount}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 card bg-neutral shadow-lg z-50 border border-secondary">
          <div className="card-body p-2 max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-base-content/70 text-center p-4">
                Brak powiadomień
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-base-200 ${
                    !n.read ? "font-semibold" : ""
                  }`}
                  onClick={() => {
                    // TODO: przekierowania
                    console.log("Kliknięto powiadomienie", n);
                  }}
                >
                  {n.type === "NEW_MATCH" ? (
                    <MatchIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ConversationIcon className="h-5 w-5 text-blue-500" />
                  )}
                  <div className="flex flex-col">
                    <span>{n.message}</span>
                    <span className="text-xs text-base-content/50">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsMenu;
