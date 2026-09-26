import { Activity, Factory, Thermometer, Zap } from "lucide-react";
import type { Machine, MotorReading } from "@/lib/dashboard-data";

type Props = { reading: MotorReading; machines: Machine[] };

export function MetricCards({ reading, machines }: Props) {
  const counts = machines.reduce((result, machine) => { result[machine.status] += 1; return result; }, { running: 0, warning: 0, danger: 0 });
  const averageTemp = machines.reduce((sum, machine) => sum + machine.temp, 0) / machines.length;
  const averageVib = machines.reduce((sum, machine) => sum + machine.vib, 0) / machines.length;
  const metrics = [
    {
      label: "Tổng số Máy móc",
      value: "24",
      unit: "",
      icon: Factory,
      footer: (
        <>
          <span className="text-emerald-600">● {counts.running + 15} Chạy</span>
          <span className="text-amber-500">● {counts.warning + 1} Cảnh báo</span>
          <span className="text-rose-600">● 1 Dừng</span>
        </>
      ),
    },
    {
      label: "Nhiệt độ Trung bình",
      value: averageTemp.toFixed(1),
      unit: "°C",
      icon: Thermometer,
      footer: (
        <>
          <span>Giới hạn: 85°C</span>
          <span className="font-medium text-amber-500">↗ +1.2°C/h</span>
        </>
      ),
    },
    {
      label: "Độ rung Trung bình",
      value: averageVib.toFixed(2),
      unit: "mm/s",
      icon: Activity,
      footer: (
        <>
          <span>Tiêu chuẩn: &lt; 2.5 mm/s</span>
          <span className="font-medium text-emerald-600">✓ An toàn</span>
        </>
      ),
    },
    {
      label: "Hiệu suất OEE Tổng",
      value: "94.2",
      unit: "%",
      icon: Zap,
      footer: (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
          <div className="h-full rounded-full bg-emerald-600" style={{ width: "94.2%" }} />
        </div>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map(({ label, value, unit, icon: Icon, footer }) => (
        <div key={label} className="rounded-lg border border-slate-700 bg-slate-800 p-4 shadow-sm">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-400">{label}</p>
              <div className="mt-1 flex items-baseline gap-1.5">
                <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
                <span className="text-sm text-slate-400">{unit}</span>
              </div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-700 text-slate-300">
              <Icon size={17} />
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">{footer}</div>
        </div>
      ))}
    </section>
  );
}
