import cv2
import argparse
import supervision as sv
import os
import time
import requests
import numpy as np
import uuid
from src.tracker import Tracker
from src.compliance import ComplianceManager
from src.detector import PPEDetector
from src.visualizer import Visualizer

# Flask & Threading
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import threading

# Configuration
BACKEND_URL = os.getenv("BACKEND_URL", "http://backend:8000/api/v1")
CAMERA_ID = os.getenv("CAMERA_ID", str(uuid.uuid4()))

# Flask App
app = Flask(__name__)
CORS(app)

# Global State
output_frame = None
output_lock = threading.Lock()

# Control State
current_source = "test_video.mp4"
is_mock = False
source_lock = threading.Lock()
restart_requested = False

def generate_frames():
    """Generator function for streaming video frames."""
    global output_frame
    
    # Placeholder
    placeholder = np.zeros((480, 640, 3), dtype=np.uint8)
    placeholder[:] = (20, 20, 20) 
    cv2.putText(placeholder, "Aegis SafeGuard", (180, 200), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(placeholder, "Initializing Stream...", (180, 250), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 1)
    
    _, placeholder_encoded = cv2.imencode(".jpg", placeholder)
    placeholder_bytes = placeholder_encoded.tobytes()

    while True:
        frame_to_encode = output_frame

        if frame_to_encode is None:
            try:
                yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
                      placeholder_bytes + b'\r\n')
            except GeneratorExit:
                break
            except Exception:
                pass
            time.sleep(0.1)
            continue
            
        try:
            (flag, encodedImage) = cv2.imencode(".jpg", frame_to_encode)
            if not flag:
                continue
            yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
                  bytearray(encodedImage) + b'\r\n')
        except GeneratorExit:
            break
        except Exception as e:
            print(f"Stream Error: {e}")
            time.sleep(0.1)
            continue
        
        time.sleep(0.04)

@app.route("/video_feed")
def video_feed():
    return Response(generate_frames(), mimetype="multipart/x-mixed-replace; boundary=frame")

@app.route("/health")
def health():
    return {"status": "ok"}

@app.route("/videos")
def list_videos():
    """List available video files in the current directory."""
    files = [f for f in os.listdir('.') if f.endswith(('.mp4', '.avi', '.mov'))]
    return jsonify({"videos": files, "current": current_source})

@app.route("/change_source", methods=['POST'])
def change_source():
    """Change the active video source."""
    global current_source, restart_requested, is_mock
    data = request.json
    new_source = data.get("source")
    
    if not new_source:
        return jsonify({"error": "No source provided"}), 400
    
    if not os.path.exists(new_source):
        return jsonify({"error": "File not found"}), 404

    with source_lock:
        current_source = new_source
        is_mock = False
        restart_requested = True
        
    return jsonify({"status": "switching", "source": new_source})

class EventReporter:
    def __init__(self, backend_url, camera_id):
        self.backend_url = backend_url
        self.camera_id = camera_id
        self.last_sent = {}
        self.cooldown = 5.0 # seconds

    def report(self, new_events):
        for event in new_events:
            self.send_event(event["type"], {
                "person_id": event["person_id"],
                "violation": event["details"]
            }, person_id=event["person_id"])

    def send_event(self, event_type, metadata, person_id=None):
        payload = {
            "event_type": event_type,
            "camera_id": self.camera_id,
            "person_id": person_id,
            "metadata_": metadata,
        }
        try:
            requests.post(f"{self.backend_url}/events/", json=payload, timeout=1)
            print(f"Reported event: {event_type} for {person_id}", flush=True)
        except Exception as e:
            print(f"Failed to report event: {e}", flush=True)

def video_processing_thread(initial_source, initial_mock):
    global output_frame, current_source, is_mock, restart_requested
    
    current_source = initial_source
    is_mock = initial_mock

    # Initialize components
    detector = PPEDetector()
    tracker = Tracker()
    visualizer = Visualizer()
    compliance_manager = ComplianceManager()
    reporter = EventReporter(BACKEND_URL, CAMERA_ID)

    while True:
        # Outer loop for handling source restarts
        restart_requested = False
        
        cap = None
        if not is_mock:
            if isinstance(current_source, str):
                if not os.path.exists(current_source):
                    print(f"Error: File {current_source} not found. Fallback to MOCK mode.", flush=True)
                    is_mock = True
                else:
                    cap = cv2.VideoCapture(current_source)
                    if not cap.isOpened():
                        print(f"Error: Could not open source {current_source}. Fallback to MOCK mode.", flush=True)
                        is_mock = True
                    else:
                        print(f"Successfully opened video source: {current_source}", flush=True)

        print(f"Video processing started (Mock={is_mock})...", flush=True)

        while not restart_requested:
            if is_mock:
                frame = np.zeros((720, 1280, 3), dtype=np.uint8)
                cv2.putText(frame, f"MOCK MODE - {current_source} Missing", (100, 360), 
                            cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 255), 3)
                t = time.time()
                x = int(600 + 200 * np.sin(t))
                cv2.circle(frame, (x, 500), 50, (0, 255, 0), -1)
                output_frame = frame.copy()
                time.sleep(0.04) 
                continue
                
            ret, frame = cap.read()
            if not ret:
                print("End of video, looping...", flush=True)
                if isinstance(current_source, str):
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    continue
                break # Should not happen unless seek failed
            
            # Detect
            results = detector.detect(frame)
            detections = sv.Detections.from_ultralytics(results)

            # Track
            detections = tracker.update(detections)
            
            # Compliance
            new_events = compliance_manager.check_compliance(detections, detections.tracker_id)
            reporter.report(new_events)
            
            # Visualize Status Reconstruction
            compliance_status = {}
            if detections.tracker_id is not None:
                for tid in detections.tracker_id:
                    if tid in compliance_manager.active_violations and compliance_manager.active_violations[tid]:
                        v_type = list(compliance_manager.active_violations[tid].keys())[0]
                        compliance_status[tid] = v_type
                    else:
                        compliance_status[tid] = "compliant"

            annotated_frame = visualizer.annotate(frame.copy(), detections, compliance_status)
            output_frame = annotated_frame.copy()
            time.sleep(0.01)
            
        # Cleanup before restart
        if cap:
            cap.release()
        print("Switching video source...", flush=True)

def main(source, mock=False):
    t = threading.Thread(target=video_processing_thread, args=(source, mock), daemon=True)
    t.start()
    
    print("Starting Flask Server on port 5000...", flush=True)
    app.run(host="0.0.0.0", port=5000, debug=False, use_reloader=False)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=str, default="test_video.mp4", help="Video source")
    parser.add_argument("--mock", action="store_true", help="Use mock data")
    args = parser.parse_args()
    
    main(args.source, args.mock)
