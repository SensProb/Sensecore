import { Bot, ChevronRight, Cog, Droplets, Expand, RefreshCw, Wind } from "lucide-react";
import type { Machine, MachineStatus } from "@/lib/dashboard-data";

type Props = { machines: Machine[]; filter: "all" | MachineStatus; onFilterChange: (filter: "all" | MachineStatus) => void; onSelect: (machine: Machine) => void };
const icons = { cog: Cog, wind: Wind, refresh: RefreshCw, compress: Expand, bot: Bot, faucet: Droplets };

const statusStyles = {
  running: {
    label: "Hoạt động",
    badge: "border-emerald-800 bg-emerald-900/40 text-emerald-400",
    cardBorder: "border-slate-700",
  },
  warning: {
    label: "Cảnh báo",
    badge: "border-amber-800 bg-amber-900/40 text-amber-400",
    cardBorder: "border-amber-700/60",
  },
  danger: {
    label: "Nguy hiểm",
    badge: "border-rose-800 bg-rose-900/40 text-rose-500",
    cardBorder: "border-rose-700/60",
  },
};

export function MachineGrid({ machines, filter, onFilterChange, onSelect }: Props) {
  const filtered = filter === "all" ? machines : machines.filter((machine) => machine.status === filter);
  const filters: Array<{ key: "all" | MachineStatus; label: string }> = [
    { key: "all", label: `Tất cả (${machines.length})` },
    { key: "running", label: "Hoạt động" },
    { key: "warning", label: "Cảnh báo" },
    { key: "danger", label: "Nguy hiểm/Dừng" },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-slate-100">
            <Cog size={16} className="text-slate-400" /> Danh sách Máy móc & Trạng thái Cảm biến
          </h2>
          <p className="text-xs text-slate-400">Bấm vào từng máy để xem dữ liệu chi tiết chuyên sâu</p>
        </div>
        <div className="flex items-center gap-1 self-start rounded-md border border-slate-700 bg-slate-800 p-1 sm:self-auto">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === key ? "bg-slate-700 text-slate-100" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((machine) => {
          const Icon = icons[machine.icon];
          const status = statusStyles[machine.status];
          return (
            <button
              key={machine.id}
              onClick={() => onSelect(machine)}
              className={`rounded-lg border bg-slate-800 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-slate-600 ${status.cardBorder}`}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-700 text-slate-300">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{machine.name}</h4>
                    <p className="text-[10px] text-slate-400">ID: {machine.id} • {machine.type}</p>
                  </div>
                </div>
                <span className={`flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${status.badge}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {status.label}
                </span>
              </div>
              <div className="my-3 grid grid-cols-3 gap-2 rounded-md border border-slate-700 bg-slate-900 p-2.5 text-xs">
                <div className="text-center">
                  <div className="text-[9px] text-slate-500">Nhiệt độ</div>
                  <div className={`font-semibold ${machine.temp > 75 ? "text-rose-500" : "text-slate-200"}`}>{machine.temp.toFixed(1)}°C</div>
                </div>
                <div className="border-x border-slate-700 text-center">
                  <div className="text-[9px] text-slate-500">Độ rung</div>
                  <div className={`font-semibold ${machine.vib > 2.5 ? "text-amber-500" : "text-slate-200"}`}>{machine.vib.toFixed(2)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[9px] text-slate-500">Áp suất</div>
                  <div className="font-semibold text-slate-200">{machine.press.toFixed(1)} bar</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-slate-400">Công suất: <span className="font-semibold text-slate-200">{machine.power} kW</span></span>
                <span className="flex items-center gap-1 text-blue-400 hover:text-blue-300">Chi tiết <ChevronRight size={12} /></span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
