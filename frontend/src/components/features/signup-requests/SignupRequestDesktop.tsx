import { Building2, Mail, UserPlus } from "lucide-react";
import type { SignupRequest } from "../../../types"; // Ajusta según tu ruta de tipos
import RequestRowSkeleton from "./RequestRowSkeleton";
import ActionButtons from "./shared/ActionButtons";

interface Props {
  requests: SignupRequest[];
  isLoading: boolean;
  processingId: string | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => void;
}

export default function SignupRequestsDesktop({
  requests,
  isLoading,
  processingId,
  onApprove,
  onReject,
}: Props) {
  const skeletonRows = ["req-sk-1", "req-sk-2", "req-sk-3"];

  return (
    <div className="hidden md:block bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Emprendimiento
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Roles
            </th>
            <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {isLoading
            ? skeletonRows.map((id) => <RequestRowSkeleton key={id} />)
            : requests.map((request) => (
                <tr
                  key={request.id}
                  className={`hover:bg-gray-50/50 transition-colors ${processingId === request.id ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
                        <UserPlus size={16} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-gray-900 truncate">
                          {request.user_name}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1 truncate">
                          <Mail size={12} /> {request.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 size={14} className="text-gray-400" />
                      {request.entrepreneurship_name || (
                        <span className="text-gray-300 italic">N/A</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {request.role.map((r) => (
                        <span
                          key={r}
                          className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase"
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ActionButtons
                      processingId={processingId}
                      requestId={request.id}
                      onApprove={onApprove}
                      onReject={onReject}
                    />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
