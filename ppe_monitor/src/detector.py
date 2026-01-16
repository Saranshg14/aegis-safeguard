from ultralytics import YOLO
import supervision as sv

class PPEDetector:
    def __init__(self, model_path="yolov8n.pt"):
        self.model = YOLO(model_path)

    def detect(self, frame):
        # Return raw results, we'll convert to sv.Detections outside or here
        # Returning results object for flexibility
        return self.model(frame, verbose=False)[0]
