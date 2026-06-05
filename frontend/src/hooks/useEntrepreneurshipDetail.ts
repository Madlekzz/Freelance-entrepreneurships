import { useEffect, useState } from "react";
import {
  getEntrepreneurshipById,
} from "../services/entrepreneurshipService";
import type { Entrepreneurship } from "../types";

export function useEntrepreneurshipDetail(id: string | undefined) {
  const [data, setData] = useState<Entrepreneurship | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const result = await getEntrepreneurshipById(id);
        setData(result);
      } catch (error) {
        console.error("Error al obtener el detalle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { data, loading };
}
