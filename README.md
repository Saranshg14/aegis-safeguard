# Aegis SafeGuard v2.4 - AI Industrial Safety Platform 🛡️

Aegis SafeGuard is an enterprise-grade, real-time computer vision system designed to monitor industrial sites for PPE (Personal Protective Equipment) compliance. It combines state-of-the-art AI detection with a professional command center dashboard to ensure worker safety.

![Status](https://img.shields.io/badge/Status-Active_RC1-success)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Python](https://img.shields.io/badge/Python-3.11-yellow)
![React](https://img.shields.io/badge/React-18-cyan)

## 🚀 Key Features

*   **Live Operations Center**: A 4-camera grid view monitoring multiple zones simultaneously ("Entrance Gate", "Assembly Line", "Loading Dock", "Storage Aisle").
*   **Hybrid AI Engine**: 
    *   **Live AI**: Real-time server-side processing for active feeds (e.g., Webcam/RTSP).
    *   **Simulated Overlays**: Client-side AI simulation for static video feeds to demonstrate scale.
*   **Real-time Analytics**:
    *   **Compliance Reports**: Live charts showing violation trends and distribution (Helmet vs Vest).
    *   **Audit Logs**: Searchable history of every safety incident with timestamps.
*   **Enterprise UX**:
    *   **Dark Mode**: Professional, low-strain interface for 24/7 monitoring centers.
    *   **Digital Twin Map**: Integrated floor map showing worker positions in real-time.
*   **Configuration**: Persistent settings for detection thresholds and notification alerts (Email/Slack).

## 🛠️ Quick Start

### Prerequisites
*   Docker & Docker Compose
*   Webcam (Optional, for live demo)

### Installation
1.  Clone the repository.
2.  Start the full stack:
    ```bash
    docker compose up --build -d
    ```

### Accessing the System
*   **Dashboard**: [http://localhost:3000](http://localhost:3000) - The main Command Center.
*   **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs) - FASTAPI Swagger UI.
*   **Monitor Service**: `http://localhost:5000` - AI Video Streamer.

## 📂 Project Structure

*   `ppe_monitor/`: Computer Vision service (YOLOv8 + Flask). Handles video processing.
*   `backend/`: Central API (FastAPI) managing events, stats, and data persistence.
*   `dashboard/`: Modern React/Vite frontend with Recharts and custom UI components.
*   `compose.yaml`: Orchestrates the microservices (Backend, Dashboard, Monitor, DB, Redis).

## 🎮 Usage Guide

1.  **Live Monitoring**: Go to **Live Operations**. Use the dropdown on the first camera to switch between "Site Videos" or "Webcam (Local)".
2.  **Check Reports**: Visit **Compliance Reports** to see the "Total Detections" (last 5m) and violation analysis.
3.  **Review Incidents**: Check **Audit Logs** for a tabular view of all safety events.
4.  **Configure**: Use **Configuration** to adjust sensitivity or toggle logging.

---
*Built for the IIT Hackathon 2025.*
