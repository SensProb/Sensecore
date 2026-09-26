import { Bell, Menu, Pause, Play, UserRound } from "lucide-react";
import type { ConnectionState } from "@/lib/dashboard-data";

type HeaderProps = { connection: ConnectionState; simulationEnabled: boolean; onToggleSimulation: () => void; onOpenMenu: () => void; alertCount: number };

export function Header({ connection, simulationEnabled, onToggleSimulation, onOpenMenu, alertCount }: HeaderProps) {
  const connected = connection === "connected";
  return (
    <header className="z-10 flex min-h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button className="text-slate-400 hover:text-slate-200 md:hidden" onClick={onOpenMenu} aria-label="Mở menu">
          <Menu size={20} />
        </button>
        <div className="hidden items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs sm:flex">
          <span className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-rose-500"}`} />
          <span className="text-slate-300">
            Hệ thống:{" "}
            <span className={connected ? "font-medium text-emerald-400" : "font-medium text-rose-400"}>
              {connected ? "Realtime" : connection}
            </span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Độ trễ: <span className="text-slate-200">12ms</span></span>
        </div>
        <select className="cursor-pointer rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 outline-none transition focus:border-blue-500">
          <option>Nhà máy A - Dây chuyền 01 (Cơ khí)</option>
          <option>Nhà máy A - Dây chuyền 02 (Đóng gói)</option>
          <option>Nhà máy B - Khu Thủy lực & Khí nén</option>
        </select>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleSimulation}
          className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-slate-600 hover:text-slate-100 sm:px-3"
        >
          {simulationEnabled
            ? <Play size={13} className="text-emerald-500" />
            : <Pause size={13} className="text-amber-500" />}
          <span className="hidden sm:inline">Giả lập: {simulationEnabled ? "ON" : "PAUSED"}</span>
        </button>
        <button
          className="relative flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-800 text-slate-400 transition hover:text-slate-200"
          aria-label="Thông báo"
        >
          <Bell size={15} />
          {alertCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
              {alertCount}
            </span>
          )}
        </button>
        <div className="flex items-center gap-2.5 border-l border-slate-700 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-300">
            <UserRound size={14} />
          </div>
          <div className="hidden text-left lg:block">
            <div className="text-xs font-medium text-slate-200">Kỹ sư Vận hành</div>
            <div className="text-[10px] text-slate-400">Shift A - Supervisor</div>
          </div>
        </div>
      </div>
    </header>
  );
}
