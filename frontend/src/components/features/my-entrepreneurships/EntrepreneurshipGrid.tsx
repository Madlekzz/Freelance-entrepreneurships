import type { Entrepreneurship } from "../../../types";
import CardSkeleton from "./CardSkeleton";
import EntrepreneurshipCard from "./EntrepreneurshipCard";
import EntrepreneurshipEmptyState from "./EntrepreneurshipEmptyState";

interface Props {
  items: Entrepreneurship[];
  loading: boolean;
  searchQuery: string;
  onAddEntrepreneurship: () => void;
  onEdit: (biz: Entrepreneurship) => void;
  onDelete: (id: string, name: string) => void;
}

export default function EntrepreneurshipGrid({
  items,
  loading,
  searchQuery,
  onAddEntrepreneurship,
  onEdit,
  onDelete,
}: Props) {
  const skeletonRows = ["sk-1", "sk-2", "sk-3"];

  if (loading && items.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skeletonRows.map((id) => (
          <CardSkeleton key={id} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EntrepreneurshipEmptyState
        searchQuery={searchQuery}
        onAddEntrepreneurship={onAddEntrepreneurship}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((biz) => (
        <EntrepreneurshipCard
          key={biz.id}
          biz={biz}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
