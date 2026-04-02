import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { getConsumerPurchases } from "../services/saleService";
import { toast } from "react-toastify/unstyled";
import type { ConsumerSale } from "../types";

export const useConsumerSales = () => {
  const [sales, setSales] = useState<ConsumerSale[]>([]); // Aquí llegarán Sales con SaleItems dentro
  const [loading, setLoading] = useState(true);

  const fetchMySales = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) return;

      const data = await getConsumerPurchases(session.user.id);
      setSales(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al registrar la compra",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySales();
  }, []);

  return { sales, loading, refresh: fetchMySales };
};
