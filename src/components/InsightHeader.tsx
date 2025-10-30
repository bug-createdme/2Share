import React, { useState } from "react";
import { Settings, Calendar } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface DateRange {
  from: string;
  to: string;
}

const InsightsHeader: React.FC = () => {
  const [range, setRange] = useState<DateRange>({
    from: "2025-06-26",
    to: "2025-07-02",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRange((prev) => ({ ...prev, [name]: value }));
  };

  const formattedRange =
    range.from && range.to
      ? `Từ ${format(new Date(range.from), "dd/MM", { locale: vi })} tới ${format(
          new Date(range.to),
          "dd/MM",
          { locale: vi }
        )}`
      : "Chọn ngày";

  return (
    <header className="fixed top-0 left-0 right-0 lg:left-[200px] xl:left-[265px] bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-base sm:text-lg lg:text-2xl font-bold">Thống kê</h1>

        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Calendar Picker */}
          <div className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-400 rounded-lg sm:rounded-xl hover:bg-gray-50 transition text-xs sm:text-sm font-medium">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{formattedRange}</span>
            <span className="sm:hidden">Ngày</span>
            <div className="absolute right-0 top-12 bg-white shadow-lg border border-gray-200 rounded-2xl p-4 w-72 hidden group-hover:block">
              <p className="text-sm mb-2 text-gray-600 font-medium">Chọn khoảng thời gian</p>
              <div className="flex flex-col gap-2">
                <label className="flex justify-between items-center text-sm">
                  <span>Từ:</span>
                  <input
                    type="date"
                    name="from"
                    value={range.from}
                    onChange={handleDateChange}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-gray-700"
                  />
                </label>
                <label className="flex justify-between items-center text-sm">
                  <span>Đến:</span>
                  <input
                    type="date"
                    name="to"
                    value={range.to}
                    onChange={handleDateChange}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-gray-700"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Settings Button */}
          <button className="p-2 sm:p-3 border border-gray-400 rounded-lg sm:rounded-xl hover:bg-gray-50 transition">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default InsightsHeader;
