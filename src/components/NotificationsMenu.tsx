import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../api/apiRequest";
import { FaBell as BellIcon, FaCheckCircle as MatchIcon, FaComments as ConversationIcon } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

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
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await apiRequest<NotificationDto[]>("/notifications");
        setNotifications(data);
      } catch (err) {
        console.error("Error getting notifications.", err);
        setError(true);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: NotificationDto) => {
  try {
    await apiRequest<void>(`/notifications/read/${notif.id}`, { method: 'POST' });

    navigate(`/chat/${notif.referenceId}`);
    // console.log("Clicked notification", notif);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    setError(true);
  }
};

  return (
    <div className="relative" ref={menuRef}>
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
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer bg-base-100 hover:bg-base-300
                    ${!notif.read ? "font-semibold border-info border-l-4" : ""}
                  `}
                  onClick={() => {
                    handleNotificationClick(notif);
                  }}
                >
                  {notif.type === "NEW_MATCH" ? (
                    <MatchIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ConversationIcon className="h-5 w-5 text-blue-500" />
                  )}
                  <div className="flex flex-col">
                    <span>{notif.message}</span>
                    <span className="text-xs text-base-content/50">
                      {new Date(notif.createdAt).toLocaleString()}
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
