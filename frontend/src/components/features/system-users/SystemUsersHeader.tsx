import { UserPlus } from "lucide-react";

interface SystemUsersHeaderProps {
  onCreate: () => void;
}

export default function SystemUsersHeader({
  onCreate,
}: SystemUsersHeaderProps) {
  return (
    <div className="flex items-center justify-end mb-6">
      <button
        type="button"
        onClick={onCreate}
        className="cursor-pointer flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl transition-all shadow-sm font-medium"
      >
        <UserPlus size={18} />
        <span className="hidden sm:inline">Nuevo Usuario</span>
      </button>
    </div>
  );
}
