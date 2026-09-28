# SenseCore — Industrial IoT Dashboard

Bảng điều khiển giám sát sức khỏe thiết bị công nghiệp theo thời gian thực, kết nối dữ liệu cảm biến qua giao thức MQTT và phân tích trực quan bằng AI.

---

## Tổng quan

SenseCore là một dashboard dạng SPA (Single Page Application) được xây dựng trên nền Next.js, phục vụ nhu cầu giám sát liên tục các thông số vận hành của máy móc trong môi trường sản xuất công nghiệp. Hệ thống tiếp nhận dữ liệu telemetry từ các gateway IoT, hiển thị biểu đồ thời gian thực và phát cảnh báo tự động khi có bất thường.

---

## Tính năng chính

- **Giám sát realtime** — Dữ liệu cảm biến cập nhật liên tục qua WebSocket MQTT (cập nhật mỗi ~1.5 giây khi ở chế độ giả lập).
- **Biểu đồ trực quan** — Đồ thị đường theo dõi nhiệt độ và độ rung theo thời gian; biểu đồ cột thể hiện phụ tải công suất các thiết bị.
- **Quản lý máy móc** — Hiển thị trạng thái theo thời gian thực của 6+ thiết bị với bộ lọc theo mức độ cảnh báo.
- **Chi tiết thiết bị** — Modal popup cung cấp thông tin sâu về từng máy: cảm biến, lịch sử bảo trì, thông số kỹ thuật.
- **AI dự báo bảo trì** — Phân tích dấu hiệu bất thường (tần số, Kurtosis) để dự báo nguy cơ hỏng hóc trước khi xảy ra.
- **Nhật ký cảnh báo** — Ghi lại toàn bộ sự cố theo thời gian thực với phân loại mức độ: `danger`, `warning`, `info`.
- **Kết nối MQTT** — Tích hợp client MQTT qua WebSocket, tự động reconnect khi mất kết nối.

---

## Công nghệ sử dụng

| Công nghệ | Mục đích |
|---|---|
| [Next.js 15](https://nextjs.org) | Framework React với App Router |
| [TypeScript](https://www.typescriptlang.org) | Kiểm tra kiểu tĩnh |
| [Tailwind CSS](https://tailwindcss.com) | Styling utility-first |
| [Chart.js](https://www.chartjs.org) + [react-chartjs-2](https://react-chartjs-2.js.org) | Biểu đồ thời gian thực |
| [MQTT.js](https://github.com/mqttjs/MQTT.js) | Client MQTT qua WebSocket |
| [Lucide React](https://lucide.dev) | Bộ icon |

---

## Cấu trúc dự án

```
sensecore/
├── app/
│   ├── page.tsx              # Trang chính — chứa toàn bộ state và logic kết nối MQTT
│   ├── layout.tsx            # Root layout
│   └── globals.css           # CSS toàn cục
├── components/
│   ├── Layout/
│   │   ├── Header.tsx        # Thanh tiêu đề — trạng thái kết nối, điều khiển giả lập
│   │   └── Sidebar.tsx       # Menu điều hướng
│   └── Dashboard/
│       ├── MetricCards.tsx   # 4 thẻ KPI tổng quan (máy móc, nhiệt độ, rung, OEE)
│       ├── RealtimeCharts.tsx # Biểu đồ đường + cột realtime
│       ├── MachineGrid.tsx   # Danh sách máy móc dạng lưới, có bộ lọc
│       ├── MachineModal.tsx  # Modal chi tiết từng thiết bị
│       └── PredictiveAlerts.tsx # Dự báo AI + nhật ký cảnh báo
└── lib/
    ├── dashboard-data.ts     # Kiểu dữ liệu TypeScript và dữ liệu khởi tạo (mock)
    └── utils.ts              # Hàm tiện ích
```

---

## Mô hình dữ liệu

Dữ liệu cảm biến (`MotorReading`) được nhận từ MQTT broker hoặc sinh ra bởi bộ giả lập:

```typescript
type MotorReading = {
  node_id: string;      // Định danh node cảm biến (ví dụ: "motor_03")
  timestamp: number;    // Unix timestamp (giây)
  rms_g: number;        // Độ rung RMS (g)
  peak_freq_hz: number; // Tần số đỉnh (Hz)
  temp_c: number;       // Nhiệt độ (°C)
  health_score: number; // Điểm sức khỏe tổng hợp (0–100)
  kurtosis: number;     // Hệ số Kurtosis — chỉ số phát hiện va đập bất thường
};
```

---

## Cài đặt và chạy

**Yêu cầu:** Node.js 18+ và npm.

```bash
# 1. Cài dependencies
npm install

# 2. Chạy môi trường phát triển
npm run dev
```

Mở trình duyệt tại `http://localhost:3000`.

### Biến môi trường (tuỳ chọn)

Mặc định hệ thống kết nối tới broker công khai `test.mosquitto.org`. Để dùng broker riêng:

```env
# .env.local
NEXT_PUBLIC_MQTT_URL=wss://your-broker-host:8081/mqtt
```

---

## Chế độ hoạt động

Hệ thống tự động phát hiện trạng thái kết nối và chuyển đổi giữa hai chế độ:

- **Realtime (MQTT)** — Khi kết nối broker thành công, dữ liệu được đẩy trực tiếp từ topic `sensecore/motor_03/health`.
- **Giả lập (Simulation)** — Khi mất kết nối hoặc bật thủ công, bộ sinh dữ liệu ngẫu nhiên tự động kích hoạt, đảm bảo dashboard luôn hoạt động được trong môi trường demo hoặc phát triển.

Nút **Giả lập ON/PAUSED** ở Header cho phép tạm dừng/tiếp tục bộ sinh dữ liệu bất kỳ lúc nào.

---

## Build cho production

```bash
npm run build
npm run start
```

---

## Tác giả

Xây dựng bởi nhóm **SensProb** — [github.com/SensProb](https://github.com/SensProb)
