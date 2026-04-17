import { CheckCircle2 } from "lucide-react";

export default function RegisterSuccess() {
  return (
    <div className="flex flex-col items-center text-center py-6 gap-4 animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
        <CheckCircle2 size={32} className="text-primary" />
      </div>
      <div>
        <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
          ¡Solicitud enviada!
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          Tu solicitud fue recibida. El equipo de IT la revisará y activará tu
          cuenta en breve.
        </p>
      </div>
    </div>
  );
}
