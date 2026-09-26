import { Brain, ListChecks, Wrench } from "lucide-react";
import type { AlertRecord } from "@/lib/dashboard-data";

type Props = { alerts: AlertRecord[] };

const levelBadge = {
  danger: "bg-rose-900/40 text-rose-500 border border-rose-800",
  warning: "bg-amber-900/40 text-amber-500 border border-amber-800",
  info: "bg-blue-900/40 text-blue-400 border border-blue-800",
};

const levelText = {
  danger: "text-rose-500",
  warning: "text-amber-500",
  info: "text-blue-400",
};

export function PredictiveAlerts({ alerts }: Props) {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* AI Prediction Panel */}
      <div className="flex flex-col rounded-lg border border-slate-700 bg-slate-800 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-700 text-violet-400">
              <Brain size={15} />
            </div>
            <h3 className="text-sm font-semibold text-slate-100">AI Dự báo Bảo trì</h3>
          </div>
          <span className="rounded border border-slate-600 bg-slate-700 px-2 py-0.5 text-[10px] text-slate-300">Core v3.2</span>
        </div>
        <div className="flex flex-1 flex-col justify-center space-y-3">
          {/* Warning prediction */}
          <div className="rounded-lg border border-amber-800/50 bg-amber-900/20 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Máy Ép Thủy Lực H-02</span>
              <span className="rounded border border-amber-800 bg-amber-900/40 px-1.5 py-0.5 text-[10px] font-medium text-amber-500">Cảnh báo sớm</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Phát hiện dấu hiệu tăng độ rung bất thường ở tần số 120Hz. Dự báo nguy cơ{" "}
              <span className="font-medium text-rose-500">hỏng vòng bi trục chính</span> trong vòng{" "}
              <span className="font-medium text-slate-100">48 giờ</span> tới.
            </p>
            <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
              <Wrench size={12} /> Đề xuất: Mỡ bôi trơn lại trục & kiểm tra căn chỉnh.
            </div>
          </div>
          {/* Healthy machine */}
          <div className="rounded-lg border border-slate-700 bg-slate-900/60 p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">Máy Phay CNC-01</span>
              <span className="text-[10px] font-medium text-emerald-500">Tối ưu 98%</span>
            </div>
            <p className="text-xs text-slate-400">
              Chu kỳ bảo trì tiếp theo kiến nghị sau:{" "}
              <span className="font-medium text-slate-200">140 giờ vận hành</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Alert Log Table */}
      <div className="flex flex-col rounded-lg border border-slate-700 bg-slate-800 p-5 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
            <ListChecks size={15} className="text-amber-500" /> Nhật ký Cảnh báo & Sự cố Realtime
          </h3>
          <span className="text-xs text-slate-400">Tự động cập nhật</span>
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-700 text-[10px] text-slate-400">
              <tr>
                <th className="pb-2.5 pr-4 font-medium">Thời gian</th>
                <th className="pb-2.5 pr-4 font-medium">Thiết bị ID</th>
                <th className="pb-2.5 pr-4 font-medium">Thông số</th>
                <th className="pb-2.5 pr-4 font-medium">Mức độ</th>
                <th className="pb-2.5 font-medium">Nội dung sự cố</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 text-slate-300">
              {alerts.map((alert) => (
                <tr key={alert.id} className="transition-colors hover:bg-slate-700/30">
                  <td className="py-2.5 pr-4 text-slate-400">{alert.time}</td>
                  <td className="py-2.5 pr-4 font-medium text-slate-200">{alert.deviceId}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`rounded px-2 py-0.5 text-[10px] ${levelBadge[alert.level]}`}>{alert.parameter}</span>
                  </td>
                  <td className={`py-2.5 pr-4 text-[10px] font-semibold capitalize ${levelText[alert.level]}`}>{alert.level}</td>
                  <td className="py-2.5 text-slate-300">{alert.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
