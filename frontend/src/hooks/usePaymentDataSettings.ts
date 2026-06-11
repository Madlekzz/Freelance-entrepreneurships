import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getMyPaymentData, upsertPaymentData } from "../services/paymentDataService";
import type { EntrepreneurPaymentData } from "../types";

interface UsePaymentDataSettingsReturn {
  paymentData: EntrepreneurPaymentData[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  handleUpsert: (method: string, formData: Record<string, string>, isActive: boolean) => Promise<void>;
}

export function usePaymentDataSettings(): UsePaymentDataSettingsReturn {
  const [paymentData, setPaymentData] = useState<EntrepreneurPaymentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyPaymentData();
        setPaymentData(data);
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setError(err instanceof Error ? err.message : "Error al cargar datos de pago");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpsert = async (method: string, formData: Record<string, string>, isActive: boolean) => {
    setSaving(true);
    try {
      const updated = await upsertPaymentData(method, { data: formData, is_active: isActive });
      setPaymentData((prev) => {
        const filtered = prev.filter((p) => p.payment_method !== method);
        return [...filtered, updated];
      });
      toast.success("Datos de pago guardados correctamente");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al guardar datos de pago";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return { paymentData, loading, saving, error, handleUpsert };
}
