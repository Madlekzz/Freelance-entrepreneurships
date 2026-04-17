import { Building2, UserPlus } from "lucide-react";
import type { SignupRequest } from "../../../types";
import ActionButtons from "./shared/ActionButtons";

interface Props {
  requests: SignupRequest[];
  isLoading: boolean;
  processingId: string | null;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => void;
}

export default function SignupRequestsMobile({
  requests,
  isLoading,
  processingId,
  onApprove,
  onReject,
}: Props) {
  if (isLoading) {
    return (
      <div className="md:hidden grid grid-cols-1 gap-4 p-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="md:hidden grid grid-cols-1 gap-4 p-1">
      {requests.map((request) => (
        <div
          key={request.id}
          className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-4 ${processingId === request.id ? "opacity-50 pointer-events-none" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary shrink-0">
              <UserPlus size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-gray-900 truncate">
                {request.user_name}
              </span>
              <span className="text-xs text-gray-400 truncate">
                {request.email}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-50">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                Emprendimiento
              </span>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <Building2 size={12} />
                <span className="truncate">
                  {request.entrepreneurship_name || "N/A"}
                </span>
              </div>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">
                Roles
              </span>
              <div className="flex flex-wrap gap-1">
                {request.role.map((r) => (
                  <span
                    key={r}
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-bold uppercase"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <ActionButtons
              processingId={processingId}
              requestId={request.id}
              onApprove={onApprove}
              onReject={onReject}
              fullWidth
            />
          </div>
        </div>
      ))}
    </div>
  );
}
