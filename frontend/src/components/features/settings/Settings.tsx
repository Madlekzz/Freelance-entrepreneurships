import {
  ExternalLink,
  FileSpreadsheet,
  Link2,
  Save,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface GoogleSheetsConfig {
  spreadsheetId: string;
  sheetName: string;
  range: string;
}

export default function Settings() {
  const [config, setConfig] = useState<GoogleSheetsConfig>({
    spreadsheetId: "",
    sheetName: "Ventas",
    range: "A1:Z1000",
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleSave = async () => {
    if (!config.spreadsheetId.trim()) {
      toast.error("Por favor ingresa el ID de la hoja de cálculo");
      return;
    }

    setSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Configuración guardada correctamente");
    } catch {
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const openSheetsLink = () => {
    if (config.spreadsheetId) {
      window.open(
        `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}`,
        "_blank",
      );
    }
  };

  return (
    <div className="animate-in fade-in duration-500 pb-20">
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
              htmlFor="text"
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
                  value={config.spreadsheetId}
                  onChange={(e) =>
                    setConfig({ ...config, spreadsheetId: e.target.value })
                  }
                  placeholder="Ej: 1abc123XYZ..."
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {config.spreadsheetId && (
                <button
                  type="button"
                  onClick={openSheetsLink}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors flex items-center gap-2"
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
              htmlFor="spreadsheet-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre de la Hoja
            </label>
            <input
              type="text"
              value={config.sheetName}
              onChange={(e) =>
                setConfig({ ...config, sheetName: e.target.value })
              }
              placeholder="Ej: Ventas"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="spreadsheet-range"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Rango de Celdas
            </label>
            <input
              type="text"
              value={config.range}
              onChange={(e) => setConfig({ ...config, range: e.target.value })}
              placeholder="Ej: A1:Z1000"
              className="block w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
