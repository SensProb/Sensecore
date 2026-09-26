export type ConnectionState = "connecting" | "connected" | "disconnected";
export type MachineStatus = "running" | "warning" | "danger";

export type MotorReading = {
  node_id: string;
  timestamp: number;
  rms_g: number;
  peak_freq_hz: number;
  temp_c: number;
  health_score: number;
  kurtosis: number;
};

export type AlertRecord = {
  id: string;
  time: string;
  deviceId: string;
  parameter: string;
  level: "danger" | "warning" | "info";
  message: string;
};

export type Machine = {
  id: string;
  name: string;
  type: string;
  temp: number;
  vib: number;
  press: number;
  power: number;
  status: MachineStatus;
  icon: "cog" | "wind" | "refresh" | "compress" | "bot" | "faucet";
};

export const machinesData: Machine[] = [
  { id: "CNC-01", name: "Máy Phay CNC-01", type: "Cơ khí", temp: 64.2, vib: 1.45, press: 6.2, power: 18.5, status: "running", icon: "cog" },
  { id: "P-03", name: "Máy Nén Khí P-03", type: "Khí nén", temp: 72.8, vib: 2.1, press: 8.4, power: 32, status: "warning", icon: "wind" },
  { id: "M-08", name: "Động Cơ Băng Tải M-08", type: "Truyền động", temp: 52.1, vib: 0.95, press: 0, power: 11.2, status: "running", icon: "refresh" },
  { id: "H-02", name: "Máy Ép Thủy Lực H-02", type: "Thủy lực", temp: 81.5, vib: 3.85, press: 12.1, power: 45.8, status: "danger", icon: "compress" },
  { id: "ROB-04", name: "Robot Hàn Tự Động R-04", type: "Tự động hóa", temp: 58, vib: 1.12, press: 4.5, power: 22.4, status: "running", icon: "bot" },
  { id: "PUMP-02", name: "Bơm Bôi Trơn Trung Tâm", type: "Phụ trợ", temp: 49.5, vib: 0.82, press: 3.1, power: 7.5, status: "running", icon: "faucet" },
];

export const initialAlertLogs: AlertRecord[] = [
  { id: "alert-1", time: "11:12:05", deviceId: "H-02", parameter: "Độ rung HIGH", level: "danger", message: "Vượt ngưỡng an toàn (3.85 mm/s)" },
  { id: "alert-2", time: "11:08:42", deviceId: "P-03", parameter: "Nhiệt độ WARN", level: "warning", message: "Tăng nhanh liên tục > 70°C" },
  { id: "alert-3", time: "10:55:18", deviceId: "M-08", parameter: "Kết nối MQTT", level: "info", message: "Tái kết nối Gateway thành công" },
];

export const initialReadings: MotorReading[] = Array.from({ length: 12 }, (_, index) => ({
  node_id: "motor_03",
  timestamp: Math.floor(Date.now() / 1000) - (11 - index) * 2,
  rms_g: Number((1.7 + Math.sin(index * 0.8) * 0.12).toFixed(2)),
  peak_freq_hz: 148,
  temp_c: Number((61 + index * 0.14 + Math.sin(index * 0.6) * 0.8).toFixed(1)),
  health_score: Math.round(93 + Math.sin(index * 0.58) * 2.8),
  kurtosis: Number((3.02 + Math.sin(index * 0.7) * 0.15).toFixed(2)),
}));
