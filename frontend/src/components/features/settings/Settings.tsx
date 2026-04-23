import { Select } from "antd";
import {
  ExternalLink,
  FileSpreadsheet,
  FolderOpen,
  Link2,
  Loader2,
  RefreshCw,
  Save,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../../config/api";

interface AppConfig {
  spreadsheet_id: string;
  credits_sheet: string;
  payments_sheet: string;
}

interface SheetOption {
  value: string;
  label: string;
}

export default function Settings() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-xl">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Integración con Google Sheets
            </h2>
            <p className="text-sm text-gray-500">
              Configura la hoja de cálculo donde se transferirán las ventas
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="spreadsheet-id"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              ID de la Hoja de Cálculo
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={config.spreadsheet_id}
                  onChange={(e) =>
                    setConfig({ ...config, spreadsheet_id: e.target.value })
                  }
                  placeholder="Ej: 1abc123XYZ..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {config.spreadsheet_id && (
                <button
                  type="button"
                  onClick={openSheetsLink}
                  className="cursor-pointer px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="mt-1.5 text-xs text-gray-500">
              El ID está en la URL de tu hoja de cálculo:
              docs.google.com/spreadsheets/d/<strong>ID_AQUI</strong>/edit
            </p>
          </div>

          <div>
            <label
              htmlFor="credits-sheet"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hoja de Créditos (Consumidores)
            </label>
            <Select
              showSearch
              className="w-full"
              placeholder="Selecciona la hoja de créditos"
              value={config.credits_sheet || undefined}
              onChange={(value) =>
                setConfig({ ...config, credits_sheet: value })
              }
              options={creditsSheetOptions}
              loading={loadingSheets}
              disabled={loadingSheets || !config.spreadsheet_id}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              suffixIcon={
                loadingSheets ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FolderOpen className="w-4 h-4 text-gray-400" />
                )
              }
            />
            {!config.spreadsheet_id && (
              <p className="mt-1.5 text-xs text-gray-400">
                Ingresa el ID de la hoja de cálculo primero
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="payments-sheet"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hoja de Pagos (Emprendedores)
            </label>
            <Select
              showSearch
              className="w-full"
              placeholder="Selecciona la hoja de pagos"
              value={config.payments_sheet || undefined}
              onChange={(value) =>
                setConfig({ ...config, payments_sheet: value })
              }
              options={paymentsSheetOptions}
              loading={loadingSheets}
              disabled={loadingSheets || !config.spreadsheet_id}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              suffixIcon={
                loadingSheets ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FolderOpen className="w-4 h-4 text-gray-400" />
                )
              }
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || loadingSheets}
            className="cursor-pointer px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Upload className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Configuración
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          ¿Cómo obtener el ID de tu hoja de cálculo?
        </h3>
        <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
          <li>Abre tu hoja de cálculo en Google Sheets</li>
          <li>Copia la URL del navegador</li>
          <li>
            El ID es la cadena de caracteres entre{" "}
            <code className="bg-blue-100 px-1 rounded">/d/</code> y{" "}
            <code className="bg-blue-100 px-1 rounded">/edit</code>
          </li>
          <li>Pégalo en el campo ID de la Hoja de Cálculo</li>
        </ol>
      </div>
    </div>
  );
}
