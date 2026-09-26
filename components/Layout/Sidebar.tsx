import { Brain, ChartNoAxesColumn, FileText, Server, Settings, Microchip, TriangleAlert } from "lucide-react";

const navItems = [
  { label: "Tổng quan Live", icon: ChartNoAxesColumn, active: true },
  { label: "Thiết bị Máy móc", icon: Server, count: "24" },
  { label: "AI Bảo trì Dự báo", icon: Brain, count: "2 NEW", accent: "purple" },
  { label: "Nhật ký Sự cố", icon: TriangleAlert, count: "3", accent: "amber" },
];

export function Sidebar({ mobile = false, onClose }: { mobile?: boolean; onClose?: () => void }) {
  return (
    <aside className={`${mobile ? "fixed inset-y-0 left-0 z-50 flex" : "z-20 hidden md:flex"} w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900`}>
      <div className="flex items-center gap-3 border-b border-slate-800 p-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <Microchip size={20} />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-100">MechSense</h1>
          <p className="text-[11px] text-slate-400">AI IoT Monitoring</p>
        </div>
      </div>
      {mobile && (
        <button onClick={onClose} className="absolute right-3 top-3 text-slate-500 hover:text-slate-200" aria-label="Đóng menu">×</button>
      )}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase text-slate-500">Hệ thống giám sát</div>
        {navItems.map(({ label, icon: Icon, active, count, accent }) => (
          <button
            key={label}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
              active
                ? "bg-slate-800 text-slate-100"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Icon
              className={accent === "purple" ? "text-violet-400" : accent === "amber" ? "text-amber-500" : "text-slate-400"}
              size={16}
            />
            <span>{label}</span>
            {count && (
              <span className={`ml-auto rounded px-1.5 py-0.5 text-[10px] font-medium ${
                accent === "purple"
                  ? "bg-violet-900/50 text-violet-300"
                  : accent === "amber"
                  ? "bg-amber-900/50 text-amber-400"
                  : "bg-slate-700 text-slate-300"
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
        <div className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase text-slate-500">Cấu hình & Báo cáo</div>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200">
          <Settings size={16} /><span>Cấu hình Cảm biến</span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200">
          <FileText size={16} /><span>Xuất dữ liệu / CSV</span>
        </button>
      </nav>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-800 p-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <div className="overflow-hidden">
            <div className="truncate text-xs font-semibold text-slate-200">Gateway Node #01</div>
            <div className="text-[10px] text-slate-400">MQTT Broker: Active</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
