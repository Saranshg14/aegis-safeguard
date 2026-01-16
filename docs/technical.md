# Technical Documentation 💻

## Service Architecture

### 1. PPE Monitor Service (`/ppe_monitor`)
*   **Core Logic**: `main.py` runs two threads:
    *   **Thread 1 (Flask)**: Serves the MJPEG stream (`/video_feed`) and control APIs (`/change_source`).
    *   **Thread 2 (Vision)**: Runs the YOLOv8 inference loop.
*   **Detection Pipeline**:
    *   `src/detector.py`: Wraps `ultralytics.YOLO`.
    *   `src/tracker.py`: Wraps `supervision.ByteTrack` for persistent IDs across frames.
    *   `src/compliance.py`: `ComplianceManager` maintains a state dictionary (`active_violations`) to debounce alerts.
*   **Streaming**: Uses a global frame buffer with a `threading.Lock` (atomic reassignment in Python makes lock optional for reading, but good practice).

### 2. Backend Service (`/backend`)
*   **Framework**: FastAPI.
*   **Database**: PostgreSQL (via SQLAlchemy).
*   **Endpoints**:
    *   `POST /events/`: Log a new violation.
    *   `GET /events/`: Fetch paginated event history.
    *   `GET /stats/`: Aggregated metrics (compliance percentage, active workers).

### 3. Dashboard (`/dashboard`)
*   **Framework**: React (Vite).
*   **State Management**: `useState` and `useEffect` for polling APIs.
*   **Components**:
    *   `CameraFeed.jsx`: Handles MJPEG stream and Source Switching logic.
    *   `LogsViewer.jsx`: Renders the Data Table with pagination.

## API Specification

### Monitor API (Port 5000)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/video_feed` | MJPEG Stream (multipart/x-mixed-replace) |
| `GET` | `/videos` | List available video files |
| `POST` | `/change_source` | Switch active video input |

### Backend API (Port 8000)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/events` | List historical violations |
| `POST` | `/api/v1/events` | Create a new violation event |
| `GET` | `/api/v1/stats` | Get current dashboard statistics |

## Database Schema (PostgreSQL)

**Table: `events`**
*   `id` (Integer): Primary Key.
*   `event_type` (String): e.g., "violation".
*   `timestamp` (DateTime): Time of occurrence.
*   `person_id` (Integer): ID from the Tracker.
*   `details` (JSON): `{"violation": "Missing Helmet", "camera": "cam_01"}`.
