"use client";

import { Bar, Line } from "react-chartjs-2";
import { CategoryScale, Chart as ChartJS, Filler, Legend, LinearScale, LineElement, BarElement, PointElement, Tooltip } from "chart.js";
import type { MotorReading } from "@/lib/dashboard-data";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Filler, Tooltip, Legend);

type Props = { readings: MotorReading[] };

const baseScales = {
  x: {
    grid: { color: "#1e293b", drawBorder: false },
    ticks: { color: "#64748b", font: { size: 10 } },
    border: { color: "#1e293b" },
  },
  y: {
    grid: { color: "#1e293b", drawBorder: false },
    ticks: { color: "#64748b", font: { size: 10 } },
    border: { color: "#1e293b" },
  },
};

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 300 },
  plugins: { legend: { display: false } },
  scales: baseScales,
};

export function RealtimeCharts({ readings }: Props) {
  const labels = readings.map((reading) =>
    new Date(reading.timestamp * 1000).toLocaleTimeString("vi-VN", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
  );

  const lineData = {
    labels,
    datasets: [
      {
        label: "Nhiệt độ (°C)",
        data: readings.map((reading) => reading.temp_c),
        borderColor: "#3b82f6",
        backgroundColor: "transparent",
        borderWidth: 1.5,
        fill: false,
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: "Độ rung (mm/s x10)",
        data: readings.map((reading) => reading.rms_g * 10),
        borderColor: "#f59e0b",
        backgroundColor: "transparent",
        borderWidth: 1.5,
        borderDash: [4, 4],
        tension: 0.3,
        pointRadius: 0,
        pointHoverRadius: 4,
      },
    ],
  };

  const barData = {
    labels: ["CNC-01", "P-03", "M-08", "H-02", "R-04"],
    datasets: [
      {
        label: "Công suất (kW)",
        data: [18.5, 32, 11.2, 45.8, 22.4],
        backgroundColor: "#3b82f6",
        borderRadius: 4,
        borderWidth: 0,
      },
    ],
  };

  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Line Chart */}
      <div className="flex min-h-[340px] flex-col rounded-lg border border-slate-700 bg-slate-800 p-5 lg:col-span-2">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">Biểu đồ Nhiệt độ & Độ rung Realtime</h3>
            <p className="text-xs text-slate-400">Dữ liệu từ cảm biến tập trung (Cập nhật 1s/lần)</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="inline-block h-px w-4 bg-blue-500" /> Nhiệt độ (°C)</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-px w-4 border-t border-dashed border-amber-500" /> Độ rung (x10)</span>
          </div>
        </div>
        <div className="relative min-h-[240px] flex-1">
          <Line
            data={lineData}
            options={{ ...baseOptions, scales: { ...baseScales, y: { ...baseScales.y, min: 0, max: 100 } } }}
          />
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex min-h-[340px] flex-col rounded-lg border border-slate-700 bg-slate-800 p-5">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-100">Công suất & Áp suất Khí nén</h3>
          <p className="text-xs text-slate-400">Đo lường phụ tải hiện tại</p>
        </div>
        <div className="relative min-h-[240px] flex-1">
          <Bar data={barData} options={baseOptions} />
        </div>
      </div>
    </section>
  );
}
