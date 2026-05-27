import { DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import { ChevronDown, Layers } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "../../types";

interface Props {
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
}

export const DateRangeFilter = ({ value, onChange }: Props) => {
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);

  const label = value
    ? `${dayjs(value.start).format("DD MMM")} - ${dayjs(value.end).format("DD MMM")}`
    : "Rango de fechas";

  const handleOpen = () => {
    setStartDate(value ? dayjs(value.start) : null);
    setEndDate(value ? dayjs(value.end) : null);
    setOpen(true);
  };

  const handleApply = () => {
    if (startDate && endDate) {
      onChange({
        start: startDate.startOf("day").toDate(),
        end: endDate.endOf("day").toDate(),
      });
    } else {
      onChange(null);
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <Layers size={16} className="text-primary shrink-0" />
          <span className="truncate">{label}</span>
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      <Modal
        title="Seleccionar rango de fechas"
        open={open}
        onOk={handleApply}
        onCancel={handleCancel}
        okText="Aplicar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: !startDate || !endDate }}
      >
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="start-date" className="text-xs text-gray-500 font-medium">
              Desde
            </label>
            <DatePicker
              value={startDate}
              onChange={(d) => setStartDate(d)}
              format="DD/MM/YYYY"
              className="w-full"
              popupClassName="!z-[1050]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="end-date" className="text-xs text-gray-500 font-medium">
              Hasta
            </label>
            <DatePicker
              value={endDate}
              onChange={(d) => setEndDate(d)}
              format="DD/MM/YYYY"
              disabledDate={(d) => (startDate ? d.isBefore(startDate, "day") : false)}
              className="w-full"
              popupClassName="!z-[1050]"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};
