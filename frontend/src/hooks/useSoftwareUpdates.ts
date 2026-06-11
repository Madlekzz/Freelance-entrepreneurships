import { useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentMonthUpdates } from "../services/softwareUpdatesService";
import type { SoftwareUpdate } from "../types";

const LAST_READ_KEY = "software_updates_last_read";

interface UseSoftwareUpdatesReturn {
  updates: SoftwareUpdate[];
  loading: boolean;
  unreadCount: number;
  markAsRead: () => void;
}

export function useSoftwareUpdates(): UseSoftwareUpdatesReturn {
  const [updates, setUpdates] = useState<SoftwareUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [readVersion, setReadVersion] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCurrentMonthUpdates();
        setUpdates(data);
      } catch (err) {
        console.error("Error fetching software updates:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const lastReadAt = localStorage.getItem(LAST_READ_KEY);

  const unreadCount = useMemo(() => {
    if (!lastReadAt) return updates.length;
    const lastRead = new Date(lastReadAt);
    return updates.filter((u) => new Date(u.created_at) > lastRead).length;
  }, [updates, lastReadAt, readVersion]);

  const markAsRead = useCallback(() => {
    localStorage.setItem(LAST_READ_KEY, new Date().toISOString());
    setReadVersion((v) => v + 1);
  }, []);

  return { updates, loading, unreadCount, markAsRead };
}
