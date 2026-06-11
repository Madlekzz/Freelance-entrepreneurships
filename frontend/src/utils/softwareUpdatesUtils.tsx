import { ArrowUp, Bug, Megaphone, Palette, Sparkles } from "lucide-react";
import type { SoftwareUpdate } from "../types";

export function getCategoryIcon(category: SoftwareUpdate["category"]) {
  switch (category) {
    case "new_feature":
      return <Sparkles size={14} className="text-emerald-500 shrink-0" />;
    case "improvement":
      return <ArrowUp size={14} className="text-blue-500 shrink-0" />;
    case "bugfix":
      return <Bug size={14} className="text-red-500 shrink-0" />;
    case "style":
      return <Palette size={14} className="text-purple-500 shrink-0" />;
    default:
      return <Megaphone size={14} className="text-gray-400 shrink-0" />;
  }
}

export function getCategoryLabel(category: SoftwareUpdate["category"]) {
  switch (category) {
    case "new_feature":
      return "Nueva función";
    case "improvement":
      return "Mejora";
    case "bugfix":
      return "Corrección";
    case "style":
      return "Estilo";
    default:
      return "Actualización";
  }
}
