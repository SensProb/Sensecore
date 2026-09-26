"use client";

import { useEffect, useRef, useState } from "react";
import mqtt, { type MqttClient } from "mqtt";
import { Cable, CircleHelp, Cpu, Radio, RefreshCw } from "lucide-react";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { MachineGrid } from "@/components/Dashboard/MachineGrid";
import { MachineModal } from "@/components/Dashboard/MachineModal";
import { MetricCards } from "@/components/Dashboard/MetricCards";
import { PredictiveAlerts } from "@/components/Dashboard/PredictiveAlerts";
import { RealtimeCharts } from "@/components/Dashboard/RealtimeCharts";
import { initialAlertLogs, initialReadings, machinesData, type AlertRecord, type ConnectionState, type Machine, type MachineStatus, type MotorReading } from "@/lib/dashboard-data";

const TOPIC = "sensecore/motor_03/health";
const MQTT_URL = process.env.NEXT_PUBLIC_MQTT_URL || "wss://test.mosquitto.org:8081/mqtt";
const WINDOW_SIZE = 40;

function normalizeReading(input: Partial<MotorReading>): MotorReading | null {
  const required = [input.timestamp, input.rms_g, input.temp_c, input.health_score];
  if (required.some((value) => typeof value !== "number" || Number.isNaN(value))) return null;
  return {
    node_id: input.node_id || "motor_03",
    timestamp: input.timestamp as number,
    rms_g: input.rms_g as number,
    peak_freq_hz: typeof input.peak_freq_hz === "number" ? input.peak_freq_hz : 0,
    temp_c: input.temp_c as number,
    health_score: input.health_score as number,
    kurtosis: typeof input.kurtosis === "number" ? input.kurtosis : 3,
  };
}

function formatAlertTime(timestamp: number) {
  return new Intl.DateTimeFormat("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(timestamp * 1000);
}

export default function Dashboard() {
  const [readings, setReadings] = useState<MotorReading[]>(initialReadings);
  const [machines, setMachines] = useState<Machine[]>(machinesData);
  const [alerts, setAlerts] = useState<AlertRecord[]>(initialAlertLogs);
  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [simulationEnabled, setSimulationEnabled] = useState(true);
  const [filter, setFilter] = useState<"all" | MachineStatus>("all");
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState(initialReadings.at(-1)?.timestamp || Date.now() / 1000);
  const clientRef = useRef<MqttClient | null>(null);
  const current = readings.at(-1) || initialReadings.at(-1)!;

  useEffect(() => {
    const client = mqtt.connect(MQTT_URL, { reconnectPeriod: 5000, connectTimeout: 10000, clientId: `sensecore-web-${Math.random().toString(16).slice(2, 8)}` });
    clientRef.current = client;
    client.on("connect", () => { setConnection("connected"); client.subscribe(TOPIC); });
    client.on("reconnect", () => setConnection("connecting"));
    client.on("offline", () => setConnection("disconnected"));
    client.on("error", () => setConnection("disconnected"));
    client.on("message", (_topic, payload) => {
      try {
        const reading = normalizeReading(JSON.parse(payload.toString()));
        if (!reading) return;
        setReadings((previous) => [...previous, reading].slice(-WINDOW_SIZE));
        setLastMessage(reading.timestamp);
        if (reading.health_score < 50) {
          setAlerts((previous) => [{ id: `${reading.timestamp}-${Math.random()}`, time: formatAlertTime(reading.timestamp), deviceId: reading.node_id, parameter: reading.kurtosis > 4 ? "Kurtosis HIGH" : "Health Score LOW", level: "danger" as const, message: reading.kurtosis > 4 ? `Kurtosis vượt ngưỡng (${reading.kurtosis.toFixed(2)})` : `Health Score thấp (${reading.health_score}%)` }, ...previous].slice(0, 20));
        }
      } catch {
        // Ignore malformed MQTT payloads.
      }
    });
    return () => { client.end(true); clientRef.current = null; };
  }, []);

  useEffect(() => {
    if (!simulationEnabled || connection === "connected") return;
    const timer = window.setInterval(() => {
      setReadings((previous) => {
        const previousReading = previous.at(-1)!;
        const timestamp = Math.floor(Date.now() / 1000);
        const nextReading = { ...previousReading, timestamp, rms_g: Number((previousReading.rms_g + (Math.random() - 0.5) * 0.08).toFixed(2)), temp_c: Number((previousReading.temp_c + (Math.random() - 0.48) * 0.3).toFixed(1)), health_score: Math.max(82, Math.min(98, Math.round(previousReading.health_score + (Math.random() - 0.5) * 2))), kurtosis: Number((previousReading.kurtosis + (Math.random() - 0.5) * 0.08).toFixed(2)) };
        setLastMessage(timestamp);
        return [...previous, nextReading].slice(-WINDOW_SIZE);
      });
      setMachines((previous) => previous.map((machine) => machine.status === "danger" ? machine : { ...machine, temp: Number((machine.temp + (Math.random() * 0.6 - 0.3)).toFixed(1)), vib: Number((machine.vib + (Math.random() * 0.08 - 0.04)).toFixed(2)) }));
    }, 1500);
    return () => window.clearInterval(timer);
  }, [connection, simulationEnabled]);

  const reconnect = () => { setConnection("connecting"); clientRef.current?.reconnect(); };
  return (
    <main className="flex h-screen overflow-hidden antialiased">
      <Sidebar />
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-slate-950/60 md:hidden" onClick={() => setMobileMenuOpen(false)} />
          <Sidebar mobile onClose={() => setMobileMenuOpen(false)} />
        </>
      )}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          connection={connection}
          simulationEnabled={simulationEnabled}
          onToggleSimulation={() => setSimulationEnabled((enabled) => !enabled)}
          onOpenMenu={() => setMobileMenuOpen(true)}
          alertCount={alerts.length}
        />
        <div className="flex-1 overflow-y-auto bg-slate-950">
          <div className="space-y-6 p-4 lg:p-6">
            {/* Page heading */}
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-1 text-[11px] text-slate-500">Asset Intelligence / 03</p>
                <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
                  SenseCore <span className="font-normal text-slate-400">Industrial Dashboard</span>
                </h1>
                <p className="mt-1 text-sm text-slate-400">Giám sát sức khỏe động cơ theo thời gian thực, được phân tích bởi gateway AI.</p>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300">
                <Cpu size={13} className="text-slate-400" /> MOTOR_03
              </div>
            </div>

            <MetricCards reading={current} machines={machines} />
            <RealtimeCharts readings={readings} />
            <PredictiveAlerts alerts={alerts} />

            {/* Signal diagnostics */}
            <section className="rounded-lg border border-slate-700 bg-slate-800 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                    <Radio size={15} className="text-slate-400" /> Signal diagnostics
                  </h3>
                  <p className="mt-0.5 text-[10px] text-slate-500">Telemetry pipeline status</p>
                </div>
                <span className={`text-xs font-medium ${connection === "connected" ? "text-emerald-500" : "text-amber-500"}`}>
                  {connection}
                </span>
              </div>
              <div className="grid gap-4 text-xs sm:grid-cols-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Cable size={14} /> Topic: <span className="font-medium text-slate-200">MOTOR_03</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <RefreshCw size={14} /> Last telemetry:{" "}
                  <span className="text-slate-200">{new Date(lastMessage * 1000).toLocaleTimeString("vi-VN")}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <CircleHelp size={14} /> Gateway inference:{" "}
                  <span className="font-medium text-emerald-500">READY</span>
                </div>
                <button
                  onClick={reconnect}
                  className="flex items-center justify-center gap-2 rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-[11px] text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
                >
                  <RefreshCw size={12} /> Reconnect broker
                </button>
              </div>
            </section>

            <MachineGrid machines={machines} filter={filter} onFilterChange={setFilter} onSelect={setSelectedMachine} />

            <footer className="flex flex-col justify-between gap-2 border-t border-slate-800 pt-4 text-[11px] text-slate-600 sm:flex-row">
              <span>SenseCore telemetry platform / v1.0.0</span>
              <span>Topic: {TOPIC}</span>
            </footer>
          </div>
        </div>
      </div>
      <MachineModal machine={selectedMachine} onClose={() => setSelectedMachine(null)} />
    </main>
  );
}
