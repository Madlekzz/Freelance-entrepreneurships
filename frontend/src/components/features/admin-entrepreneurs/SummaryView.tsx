import type { EntrepreneurSummary } from "../../../types";
import { SummaryDesktop } from "./SummaryDesktop";
import { SummaryEmptyState } from "./SummaryEmptyState";
import { SummaryMobile } from "./SummaryMobile";

interface Props {
  data: EntrepreneurSummary[];
  onSelect: (id: string) => void;
  searchQuery: string;
}

export const SummaryView = ({ data, onSelect, searchQuery }: Props) => {
  if (data.length === 0) return <SummaryEmptyState query={searchQuery} />;

  return (
    <div className="grid grid-cols-1 gap-4 md:bg-white md:rounded-3xl md:border md:border-gray-100 md:shadow-sm overflow-hidden">
      <SummaryDesktop data={data} onSelect={onSelect} />
      <SummaryMobile data={data} onSelect={onSelect} />
    </div>
  );
};
