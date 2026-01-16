import supervision as sv

class Visualizer:
    def __init__(self):
        self.box_annotator = sv.BoxAnnotator()
        self.label_annotator = sv.LabelAnnotator()

    def annotate(self, frame, detections, compliance_status):
        labels = []
        for tracker_id in detections.tracker_id:
            status = compliance_status.get(tracker_id, "unknown")
            labels.append(f"#{tracker_id} {status}")

        annotated_frame = self.box_annotator.annotate(scene=frame, detections=detections)
        annotated_frame = self.label_annotator.annotate(scene=annotated_frame, detections=detections, labels=labels)
        return annotated_frame
