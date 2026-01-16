# Aegis SafeGuard - AI Industrial Safety Platform 🛡️

Aegis SafeGuard is a real-time computer vision system designed to monitor industrial sites for PPE (Personal Protective Equipment) compliance. It detects workers, checks for helmets and vests, and logs violations instantly to a central dashboard.

![Status](https://img.shields.io/badge/Status-Active-success)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)
![Python](https://img.shields.io/badge/Python-3.11-yellow)
![React](https://img.shields.io/badge/React-18-cyan)

## 🚀 Features

*   **Real-time AI Detection**: Uses YOLOv8 to detect Persons and PPE (Helmets, Vests).
*   **Live Video Feed**: Low-latency streaming to the dashboard.
*   **Multi-Camera Support**: Switch between different video feeds dynamically.
*   **Granular Alerts**: Specific warnings for "Missing Helmet" vs "Missing Vest".
*   **Incident Logging**: Persistent history of violations with timestamps and Person IDs.
*   **GPU Acceleration**: Fully optimized for NVIDIA GPUs (RTX Series).

## 🛠️ Quick Start

### Prerequisites
*   Docker & Docker Compose
*   NVIDIA GPU (Recommended) with Container Toolkit

### Installation
1.  Clone the repository.
2.  Place your video files in the `ppe_monitor` directory (optional).
3.  Run the stack:
    ```bash
    docker compose up --build -d
    ```

### Accessing the System
*   **Dashboard**: [http://localhost:3000](http://localhost:3000)
*   **Backend API**: [http://localhost:8000/docs](http://localhost:8000/docs)
*   **Monitor API**: [http://localhost:5000](http://localhost:5000)

## 📂 Project Structure

*   `ppe_monitor/`: Computer Vision service (Python/YOLO + Flask).
*   `backend/`: Main API and Database logic (FastAPI + PostgreSQL).
*   `dashboard/`: Frontend User Interface (React + Vite).
*   `compose.yaml`: Docker orchestration file.

## 🤝 Contribution
This project was built for the IIT Hackathon.
