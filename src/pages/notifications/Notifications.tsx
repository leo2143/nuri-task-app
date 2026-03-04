import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import StateMessage from "../../components/StateMessage";
import { notificationApiService } from "../../services/notificationApiService";
import { formatRelativeTime } from "../../utils";
import type { INotification, NotificationType } from "../../interfaces";
import { nuriFireCut } from "../../assets/ilustrations";

type IconEntry = { emoji: string } | { svg: string; alt: string };

const TYPE_ICONS: Record<NotificationType, IconEntry> = {
  due_task: { emoji: "📋" },
  streak_risk: { emoji: "🔥" },
  inactivity: { emoji: "👋" },
  streak_increase: { svg: nuriFireCut, alt: "Racha aumentada" },
};

function NotificationIcon({ type }: { type: NotificationType }) {
  const entry = TYPE_ICONS[type];
  if ("emoji" in entry) {
    return <span className="text-2xl mt-0.5" aria-hidden="true">{entry.emoji}</span>;
  }
  return <img src={entry.svg} alt={entry.alt} className="w-8 h-8 mt-0.5 shrink-0" />;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchNotifications = useCallback(async (cursor?: string) => {
    try {
      const response = await notificationApiService.getNotifications(cursor);
      const items = response.data ?? [];
      setNotifications((prev) => (cursor ? [...prev, ...items] : items));
      setHasMore(response.meta?.hasMore ?? false);
      setNextCursor(response.meta?.nextCursor ?? null);
    } catch {
      if (!cursor) setError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleLoadMore = () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    fetchNotifications(nextCursor);
  };

  const handleMarkAllAsRead = async () => {
    await notificationApiService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = async (notif: INotification) => {
    if (!notif.read) {
      await notificationApiService.markAsRead(notif._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n)),
      );
    }
    navigate(notif.url);
  };

  const hasUnread = notifications.some((n) => !n.read);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h2 className="font-heading">Notificaciones</h2>
        {hasUnread && (
          <button
            onClick={handleMarkAllAsRead}
            className="font-body text-sm font-semibold text-primary hover:underline"
          >
            Marcar todas como leídas
          </button>
        )}
      </header>

      {error ? (
        <StateMessage itemName="las notificaciones" variant="error" />
      ) : notifications.length === 0 ? (
        <StateMessage itemName="notificaciones" variant="notFoundList" />
      ) : (
        <>
          <ul className="flex flex-col gap-3">
            {notifications.map((notif) => (
              <li key={notif._id}>
                <button
                  type="button"
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full text-left flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                    notif.read
                      ? "border-neutral bg-white"
                      : "border-primary/30 bg-primary/5"
                  }`}
                >
                  <NotificationIcon type={notif.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3
                        className={`font-body text-sm truncate ${!notif.read ? "font-bold text-tertiary" : "font-medium text-gray-600"}`}
                      >
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="font-body text-sm text-gray-500 mt-0.5 line-clamp-2">
                      {notif.body}
                    </p>
                    <span className="font-body text-xs text-gray-400 mt-1 block">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="mx-auto font-body text-sm font-semibold text-primary hover:underline disabled:opacity-50"
            >
              {loadingMore ? "Cargando..." : "Ver más"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
