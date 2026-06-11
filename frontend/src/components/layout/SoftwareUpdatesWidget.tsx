import { ArrowUp, Bug, Loader2, Megaphone, Palette, Sparkles } from "lucide-react";
import type { SoftwareUpdate } from "../../types";

const LAST_READ_KEY = "software_updates_last_read";

interface Props {
  updates: SoftwareUpdate[];
  loading: boolean;
  unreadCount: number;
  onMarkAsRead: () => void;
  variant: "sidebar" | "popover";
}

export function getCategoryIcon(category: SoftwareUpdate["category"]) {
  switch (category) {
    case "new_feature":
      return <Sparkles size={14} className="text-emerald-500 shrink-0" />;
    case "improvement":
      return <ArrowUp size={14} className="text-blue-500 shrink-0" />;
    case "bugfix":
      return <Bug size={14} className="text-red-500 shrink-0" />;
    case "style":
      return <Palette size={14} className="text-purple-500 shrink-0" />;
    default:
      return <Megaphone size={14} className="text-gray-400 shrink-0" />;
  }
}

function getCategoryLabel(category: SoftwareUpdate["category"]) {
  switch (category) {
    case "new_feature":
      return "Nueva función";
    case "improvement":
      return "Mejora";
    case "bugfix":
      return "Corrección";
    case "style":
      return "Estilo";
    default:
      return "Actualización";
  }
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "fecha desconocida";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return "hace un momento";
  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hace ${diffHours} h`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  return `hace ${diffWeeks} semana${diffWeeks > 1 ? "s" : ""}`;
}

export default function SoftwareUpdatesWidget({
  updates,
  loading,
  unreadCount,
  onMarkAsRead,
  variant,
}: Props) {
  const lastReadAt = typeof window !== "undefined"
    ? localStorage.getItem(LAST_READ_KEY)
    : null;

  const isUnread = (created_at: string) => {
    if (!lastReadAt) return true;
    return new Date(created_at) > new Date(lastReadAt);
  };
  if (variant === "sidebar") {
    return (
      <div className="w-full">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Megaphone size={14} className="text-white/60" />
              <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                Novedades
              </h4>
              {unreadCount > 0 && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onMarkAsRead}
              className="text-[10px] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              title="Marcar como leído"
            >
              Leído
            </button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={16} className="animate-spin text-white/40" />
            </div>
          ) : updates.length === 0 ? (
            <p className="text-[11px] text-white/40 italic">
              Sin novedades este mes
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {updates.slice(0, 5).map((update) => (
                <div
                  key={update.id}
                  className="flex gap-2 items-start bg-white/5 rounded-lg px-2.5 py-2"
                >
                  <div className="mt-0.5">
                    {getCategoryIcon(update.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-white/90 truncate">
                      {update.title}
                    </p>
                    <p className="text-[10px] text-white/50 leading-tight line-clamp-2">
                      {update.description}
                    </p>
                    <p className="text-[9px] text-white/30 mt-0.5">
                      {timeAgo(update.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant: popover
  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      ) : updates.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          Sin novedades este mes
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {updates.map((update) => {
            const unread = isUnread(update.created_at);
            return (
            <div key={update.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${unread ? "bg-blue-50/50 border-l-2 border-primary" : ""}`}>
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getCategoryIcon(update.category)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${unread ? "font-semibold" : "font-medium"} text-gray-900`}>
                      {update.title}
                    </p>
                    <span className="shrink-0 whitespace-nowrap text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {getCategoryLabel(update.category)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {update.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-gray-400">
                      {timeAgo(update.created_at)}
                    </span>
                    {update.version && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        v{update.version}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
