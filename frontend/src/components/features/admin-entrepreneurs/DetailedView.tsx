import type { GlobalSale } from "../../../types";
import { DetailedDesktop } from "./DetailedDesktop";
import { DetailedMobile } from "./DetailedMobile";
import { SummaryEmptyState } from "./SummaryEmptyState";

interface Props {
  sales: GlobalSale[];
  selectedSales: string[];
  toggleSelection: (id: string) => void;
  toggleAll: () => void;
  onProcessSingle: (id: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
  processingIds: string[];
  searchQuery: string;
}

export const DetailedView = (props: Props) => {
  const { sales, searchQuery } = props;

  if (sales.length === 0) {
    return <SummaryEmptyState query={searchQuery} />;
  }

  return (
    <div className="space-y-4 md:bg-white md:rounded-3xl md:border md:border-gray-100 md:shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
      <DetailedDesktop {...props} />
      <DetailedMobile
        sales={props.sales}
        selectedSales={props.selectedSales}
        toggleSelection={props.toggleSelection}
        onProcessSingle={props.onProcessSingle}
        processingIds={props.processingIds}
      />
    </div>
  );
};
