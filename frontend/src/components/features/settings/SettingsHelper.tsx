export function SettingsHelper() {
  return (
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
  );
}