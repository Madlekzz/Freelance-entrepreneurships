import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../../config/api";
import type { AppConfig, SheetOption } from "../../../../types";

interface UseSettingsReturn {
  config: AppConfig;
  setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
  saving: boolean;
  loading: boolean;
  loadingSheets: boolean;
  creditsSheetOptions: SheetOption[];
  paymentsSheetOptions: SheetOption[];
  handleSave: () => Promise<void>;
  openSheetsLink: () => void;
}

export function useSettings(): UseSettingsReturn {
  const [config, setConfig] = useState<AppConfig>({
    spreadsheet_id: "",
    credits_sheet: "",
    payments_sheet: "",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSheets, setLoadingSheets] = useState(false);
  const [creditsSheetOptions, setCreditsSheetOptions] = useState<SheetOption[]>(
    [],
  );
  const [paymentsSheetOptions, setPaymentsSheetOptions] = useState<
    SheetOption[]
  >([]);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Record<string, string>>("/config");
      setConfig({
        spreadsheet_id: data.spreadsheet_id || "",
        credits_sheet: data.credits_sheet || "",
        payments_sheet: data.payments_sheet || "",
      });
    } catch (err) {
      console.error("Error fetching config:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSheets = useCallback(async (spreadsheetId: string) => {
    try {
      setLoadingSheets(true);
      const { data } = await api.get<{ sheets: string[] }>(
        `/config/sheets?spreadsheetId=${encodeURIComponent(spreadsheetId)}`,
      );
      const options = (data.sheets || []).map((s) => ({ value: s, label: s }));
      setCreditsSheetOptions(options);
      setPaymentsSheetOptions(options);
    } catch (err) {
      console.error("Error fetching sheets:", err);
    } finally {
      setLoadingSheets(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  useEffect(() => {
    const spreadsheetId = config.spreadsheet_id;
    if (spreadsheetId && spreadsheetId.length > 5) {
      fetchSheets(spreadsheetId);
    } else {
      setCreditsSheetOptions([]);
      setPaymentsSheetOptions([]);
    }
  }, [config.spreadsheet_id, fetchSheets]);

  const handleSave = async () => {
    if (!config.spreadsheet_id.trim()) {
      toast.error("Por favor ingresa el ID de la hoja de cálculo");
      return;
    }

    if (!config.credits_sheet || !config.payments_sheet) {
      toast.error("Selecciona las hojas de créditos y pagos");
      return;
    }

    setSaving(true);
    try {
      await api.post("/config", {
        config: {
          spreadsheet_id: config.spreadsheet_id,
          credits_sheet: config.credits_sheet,
          payments_sheet: config.payments_sheet,
        },
      });
      toast.success("Configuración guardada correctamente");
    } catch {
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const openSheetsLink = () => {
    if (config.spreadsheet_id) {
      window.open(
        `https://docs.google.com/spreadsheets/d/${config.spreadsheet_id}`,
        "_blank",
      );
    }
  };

  return {
    config,
    setConfig,
    saving,
    loading,
    loadingSheets,
    creditsSheetOptions,
    paymentsSheetOptions,
    handleSave,
    openSheetsLink,
  };
}
