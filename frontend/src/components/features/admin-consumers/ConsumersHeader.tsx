import { ArrowLeft } from "lucide-react";

interface Props {
  view: "summary" | "detailed";
  selectedConsumerName?: string;
  onBack: () => void;
}

export const ConsumersHeader = ({
  view,
  selectedConsumerName,
  onBack,
}: Props) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-5 md:p-6 rounded-4xl md:rounded-3xl border border-gray-100 shadow-sm gap-4">
    <div className="space-y-1">
      <h2 className="text-xl font-bold text-gray-900 leading-tight">
        Panel de Consumidores
      </h2>
      <p className="text-xs md:text-sm text-gray-500">
        {view === "summary"
          ? "Control de deducciones y consumos por empleado"
          : `Historial de compras: ${selectedConsumerName}`}
      </p>
    </div>

    {view === "detailed" && (
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/20 transition-all w-full sm:w-auto justify-center cursor-pointer"
      >
        <ArrowLeft size={16} />
        Volver al Resumen
      </button>
    )}
  </div>
);
