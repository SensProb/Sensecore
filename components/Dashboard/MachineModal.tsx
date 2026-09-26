import { Cog, X, Wrench } from "lucide-react";
import type { Machine } from "@/lib/dashboard-data";

type Props = { machine: Machine | null; onClose: () => void };
const labels = { running: "Đang hoạt động", warning: "Cảnh báo thông số", danger: "Nguy hiểm / Cần kiểm tra" };
const statusClasses = {
  running: "border-emerald-800 bg-emerald-900/40 text-emerald-400",
  warning: "border-amber-800 bg-amber-900/40 text-amber-500",
  danger: "border-rose-800 bg-rose-900/40 text-rose-500",
};

export function MachineModal({ machine, onClose }: Props) {
  if (!machine) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-700 text-slate-300">
              <Cog size={17} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">{machine.name}</h3>
              <p className="text-xs text-slate-400">ID: {machine.id} • {machine.type}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-slate-200"
            aria-label="Đóng"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] space-y-5 overflow-y-auto p-5">
          {/* Status */}
          <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-3">
            <span className="text-xs text-slate-400">Trạng thái vận hành:</span>
            <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusClasses[machine.status]}`}>
              {labels[machine.status]}
            </span>
          </div>

          {/* Sensor readings */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
              <div className="mb-1 text-[11px] text-slate-400">Cảm biến Nhiệt</div>
              <div className="text-xl font-bold text-amber-500">{machine.temp.toFixed(1)} °C</div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
              <div className="mb-1 text-[11px] text-slate-400">Cảm biến Độ rung</div>
              <div className="text-xl font-bold text-blue-400">{machine.vib.toFixed(2)} mm/s</div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800 p-3">
              <div className="mb-1 text-[11px] text-slate-400">Áp suất Vận hành</div>
              <div className="text-xl font-bold text-slate-100">{machine.press.toFixed(1)} Bar</div>
            </div>
          </div>

          {/* Specs */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300">Thông số kỹ thuật & Lịch sử</h4>
            <div className="divide-y divide-slate-700/60 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300">
              <div className="flex justify-between px-4 py-2.5"><span className="text-slate-400">Năm sản xuất:</span><span>2022 (Germany)</span></div>
              <div className="flex justify-between px-4 py-2.5"><span className="text-slate-400">Tổng giờ hoạt động:</span><span>4,280 Giờ</span></div>
              <div className="flex justify-between px-4 py-2.5"><span className="text-slate-400">Lần bảo trì gần nhất:</span><span>15/08/2026</span></div>
              <div className="flex justify-between px-4 py-2.5"><span className="text-slate-400">Giao thức kết nối:</span><span>Modbus TCP / MQTT</span></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-700 bg-slate-800/50 p-4">
          <button
            onClick={() => window.alert("Đã gửi yêu cầu kiểm tra kỹ thuật tới đội bảo trì thành công!")}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-500"
          >
            <Wrench size={13} /> Gửi yêu cầu Bảo trì
          </button>
        </div>
      </div>
    </div>
  );
}
