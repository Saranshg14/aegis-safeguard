# Version History 📌

## v1.3.0 - Multi-Video & Logistics
*   **Added**: Support for multiple video files.
*   **Added**: API Endpoint to switch video sources dynamically.
*   **UI**: "Source Selector" dropdown in Dashboard.
*   **Fix**: Resolved large ML dependency download timeouts.

## v1.2.0 - Granular Intelligence
*   **Added**: Stateful Compliance Logic in `ppe_monitor`.
*   **Improved**: Violations are now specific ("Missing Helmet" vs "Generic PPE").
*   **Improved**: Reduced log spam by tracking active violation life-cycles.
*   **UI**: Dashboard logs now show `Person ID`.

## v1.1.0 - GPU Acceleration
*   **Added**: generic resource reservation in `compose.yaml` for NVIDIA GPUs.
*   **Verified**: 50x inference speedup using CUDA.

## v1.0.0 - Initial Release ("Phoenix")
*   **Restored**: Full project codebase after file loss.
*   **Feature**: Basic YOLOv8 detection.
*   **Feature**: Live MJPEG Streaming.
*   **Feature**: Postgres Database integration.
