import { useEffect, useMemo, useState } from "react";
import type { CatalogProduct, EntrepreneurPaymentData, PaymentMethod } from "../types";
import { getPaymentDataByProducts } from "../services/paymentDataService";

interface UsePaymentDataCheckoutProps {
  cartEntries: { product: CatalogProduct; qty: number }[];
  paymentMethod: PaymentMethod;
  paymentType: "credit" | "immediate";
}

export function usePaymentDataCheckout({
  cartEntries,
  paymentMethod,
  paymentType,
}: UsePaymentDataCheckoutProps) {
  const [paymentData, setPaymentData] = useState<EntrepreneurPaymentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get unique product IDs from cart
  const productIds = useMemo(() => {
    const ids = new Set<string>();
    cartEntries.forEach(({ product }) => {
      ids.add(String(product.id));
    });
    return Array.from(ids);
  }, [cartEntries]);

  // Fetch payment data when payment method changes or product IDs change
  useEffect(() => {
    if (paymentType !== "immediate" || !paymentMethod || productIds.length === 0) {
      setPaymentData([]);
      return;
    }

    // Efectivo no tiene datos configurables
    if (paymentMethod === "efectivo") {
      setPaymentData([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPaymentDataByProducts(productIds);
        // Filter by selected payment method (server also filters by is_active)
        const filtered = data.filter((d) => d.payment_method === paymentMethod);
        setPaymentData(filtered);
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setError(err instanceof Error ? err.message : "Error al cargar datos de pago");
        setPaymentData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [paymentMethod, paymentType, productIds]);

  return { paymentDisplayData: paymentData, loading, error };
}
