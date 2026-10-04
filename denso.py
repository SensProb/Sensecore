import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
import time
from datetime import datetime

st.set_page_config(
    page_title="SenseCore",
    page_icon="⚙️",                                        
    layout="wide",                                         
    initial_sidebar_state="expanded"                       
)

st.markdown("""
    <style>
    .main {
        background-color: #0b0f19;
        color: #f1f5f9;
    }
    .stMetric {
        background-color: #161e2e;
        border: 1px solid #243049;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
    }
    .stMetric label {
        color: #94a3b8 !important;
        font-size: 0.9rem !important;
    }
    .stMetric div[data-testid="stMetricValue"] {
        color: #38bdf8 !important;
        font-weight: 700;
    }
    .status-card {
        background-color: #161e2e;
        border: 1px solid #243049;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 12px;
    }
    .badge-active {
        background-color: rgba(34, 197, 94, 0.2);
        color: #4ade80;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .badge-warning {
        background-color: rgba(245, 158, 11, 0.2);
        color: #fbbf24;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .badge-danger {
        background-color: rgba(239, 68, 68, 0.2);
        color: #f87171;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    </style>
    """, unsafe_allow_html=True)

if "history" not in st.session_state:
    now = datetime.now()
    times = [now - pd.Timedelta(seconds=i*5) for i in range(20, -1, -1)]
    st.session_state.history = pd.DataFrame({
        "Time": times,
        "Temp": np.random.normal(72, 3, size=21),
        "Vibration": np.random.normal(3.8, 0.4, size=21),
        "Pressure": np.random.normal(101.3, 1.5, size=21)
    })
machines_data = [
    {"id": "MAY-01", "name": "Mô bin", "status": "Hoạt động", "temp": 68.5, "vib": 3.2, "oee": 94},
    {"id": "MAY-02", "name": "Cánh Tay Robot", "status": "Cảnh báo", "temp": 82.1, "vib": 6.8, "oee": 78},
    {"id": "MAY-03", "name": "Dàn nóng Denso", "status": "Hoạt động", "temp": 71.0, "vib": 2.9, "oee": 88},
    {"id": "MAY-04", "name": "Máy ép trung tâm", "status": "Dừng máy", "temp": 42.0, "vib": 0.1, "oee": 0},
]

with st.sidebar:
    st.title("⚙️ SENSECORE")
    st.caption("Mạng lưới giám sát sức khỏe máy móc")
    st.divider()

    st.subheader("📟 Bảng điều khiển")
    auto_refresh = st.checkbox("Bật Giả lập Realtime (Live)", value=True)
    refresh_rate = st.slider("Tần số cập nhật (giây)", 1, 5, 2)
    
    selected_machine = st.selectbox(
        "Chọn thiết bị theo dõi:",
        options=[m["id"] + " - " + m["name"] for m in machines_data]
    )
    st.divider()
    st.subheader("🤖 AI health status")
    st.warning("⚠️ **Phát hiện dị thường (MAY-02):"
        "** Độ rung vượt ngưỡng 6.8 mm/s. Nguy cơ mài mòn vòng bi trong 48h tới.")

st.title("📊 Machinery health monitoring")
st.caption(f"Cập nhật lần cuối: {datetime.now().strftime('%H:%M:%S - %d/%m/%Y')}")

col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("Tổng thiết bị", "4 Máy", "1 Cảnh báo / 1 Dừng")
with col2:
    curr_temp = round(st.session_state.history["Temp"].iloc[-1], 1)
    st.metric("Nhiệt độ TB", f"{curr_temp} °C", f"{round(curr_temp - 70, 1)} °C")
with col3:
    curr_vib = round(st.session_state.history["Vibration"].iloc[-1], 2)
    st.metric("Độ rung TB", f"{curr_vib} mm/s", f"{round(curr_vib - 3.5, 2)} mm/s")
with col4:
    st.metric("Hiệu suất OEE", "87.5%", "+2.3% hôm nay")

st.markdown("---")

c_chart1, c_chart2 = st.columns(2)

with c_chart1:
    st.subheader("📈 Nhiệt độ & Độ rung theo thời gian")
    
    fig_line = go.Figure()
    fig_line.add_trace(go.Scatter(
        x=st.session_state.history["Time"],
        y=st.session_state.history["Temp"],
        mode='lines+markers',
        name='Nhiệt độ (°C)',
        line=dict(color='#38bdf8', width=2)
    ))
    fig_line.add_trace(go.Scatter(
        x=st.session_state.history["Time"],
        y=st.session_state.history["Vibration"] * 10,  
        mode='lines+markers',
        name='Độ rung (x10 mm/s)',
        line=dict(color="#e90ebd", width=2, dash='dot')
    ))
    fig_line.update_layout(
        template="plotly_dark",
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(22, 30, 46, 0.5)',
        margin=dict(l=20, r=20, t=30, b=20),
        height=320,
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
    )
    st.plotly_chart(fig_line, use_container_width=True)

with c_chart2:
    st.subheader("⚡Phân bổ OEE các thiết bị")
    
    df_machines = pd.DataFrame(machines_data)
    fig_bar = px.bar(
        df_machines,
        x="id",
        y="oee",
        color="status",
        color_discrete_map={"Hoạt động": "#22c55e", "Cảnh báo": "#f59e0b", "Dừng máy": "#ef4444"},
        text="oee"
    )
    fig_bar.update_layout(
        template="plotly_dark",
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(22, 30, 46, 0.5)',
        margin=dict(l=20, r=20, t=30, b=20),
        height=320,
        yaxis_title="Hiệu suất (%)",
        xaxis_title="Mã máy"
    )
    st.plotly_chart(fig_bar, use_container_width=True)

st.subheader("📋 Trạng thái chi tiết các Cảm biến Thiết bị")
cols = st.columns(4)

for idx, m in enumerate(machines_data):
    with cols[idx]:
        badge_class = "badge-active" if m["status"] == "Hoạt động" else ("badge-warning" if m["status"] == "Cảnh báo" else "badge-danger")
        
        st.markdown(f"""
            <div class="status-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="margin:0; color:#f8fafc;">{m['id']}</h4>
                    <span class="{badge_class}">{m['status']}</span>
                </div>
                <p style="color:#94a3b8; font-size:0.85rem; margin-top:4px;">{m['name']}</p>
                <hr style="border-color:#243049; margin:10px 0;">
                <div style="font-size:0.9rem; line-height:1.6;">
                    🌡️ Nhiệt độ: <b>{m['temp']} °C</b><br>
                    📳 Độ rung: <b>{m['vib']} mm/s</b><br>
                    ⚡ OEE: <b>{m['oee']}%</b>
                </div>
            </div>
        """, unsafe_allow_html=True)
if auto_refresh:
    time.sleep(refresh_rate)

    new_time = datetime.now()
    new_temp = np.clip(st.session_state.history["Temp"].iloc[-1] + np.random.uniform(-1.5, 1.5), 50, 95)
    new_vib = np.clip(st.session_state.history["Vibration"].iloc[-1] + np.random.uniform(-0.2, 0.2), 1.0, 8.0)
    new_press = np.clip(st.session_state.history["Pressure"].iloc[-1] + np.random.uniform(-0.5, 0.5), 90, 110)
    
    new_row = pd.DataFrame({
        "Time": [new_time],
        "Temp": [new_temp],
        "Vibration": [new_vib],
        "Pressure": [new_press]
    })
    
    st.session_state.history = pd.concat([st.session_state.history, new_row], ignore_index=True).tail(25)

    st.rerun()