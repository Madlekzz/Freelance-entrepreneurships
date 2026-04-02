import { useEffect, useState } from "react";
import {
  type Entrepreneurship,
  getEntrepreneurshipById,
} from "../services/entrepreneurshipService";

// hooks/useEntrepreneurshipDetail.ts (o dentro del mismo archivo)
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
