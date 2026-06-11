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

  // Determine if we should fetch payment data
  const shouldFetch =
    paymentType === "immediate" &&
    !!paymentMethod &&
    paymentMethod !== "efectivo" &&
    productIds.length > 0;

  // Fetch payment data when conditions are met
  useEffect(() => {
    if (!shouldFetch) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getPaymentDataByProducts(productIds);
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
  }, [shouldFetch, paymentMethod, productIds]);

  // Derive display data: empty when conditions aren't met, fetched data otherwise
  const paymentDisplayData = useMemo(() => {
    if (!shouldFetch) return [];
    return paymentData;
  }, [shouldFetch, paymentData]);

  // Only show loading indicator when we're actually fetching
  const displayLoading = shouldFetch && loading;

  return { paymentDisplayData, loading: displayLoading, error };
}
