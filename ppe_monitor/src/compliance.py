import time

class ComplianceManager:
    def __init__(self):
        # Track active violations to prevent spamming the logs
        # Format: { person_id: { 'violation_type': last_reported_time } }
        self.active_violations = {}
        self.cooldown = 5.0 # Seconds before re-reporting same violation

    def check_compliance(self, detections, tracker_ids):
        """
        Returns a list of NEW violations to report.
        """
        new_events = []
        current_frame_ids = []

        if tracker_ids is None:
            return []

        for box, track_id in zip(detections.xyxy, tracker_ids):
            current_frame_ids.append(track_id)
            
            # --- COMPLIANCE LOGIC ---
            # NOTE: For Real PPE Model, check if 'helmet'/'vest' boxes overlap with 'person' box.
            # CURRENT: Simulation Logic (since standard YOLOv8n only detects 'person')
            
            violations = []
            
            # Simulate "Missing Helmet" for IDs divisible by 3
            if track_id % 3 == 0:
                violations.append("Missing Helmet")
            
            # Simulate "Missing Vest" for IDs divisible by 4
            if track_id % 4 == 0:
                violations.append("Missing Vest")

            # Check vs Active States
            for v_type in violations:
                should_report = False
                
                # If person not in tracking, init
                if track_id not in self.active_violations:
                    self.active_violations[track_id] = {}
                
                # If violation not active for person, report
                if v_type not in self.active_violations[track_id]:
                    should_report = True
                    self.active_violations[track_id][v_type] = time.time()
                else:
                    # Optional: Re-report after cooldown? 
                    # For now, let's keep it quiet until resolved.
                    pass

                if should_report:
                    new_events.append({
                        "person_id": int(track_id),
                        "type": "violation",
                        "details": v_type
                    })
        
        # Cleanup: Remove track_ids not in current frame (Person left)
        # In a real system, we'd wait a few frames to be sure.
        # Simple version:
        active_ids = list(self.active_violations.keys())
        for pid in active_ids:
            if pid not in current_frame_ids:
                del self.active_violations[pid]

        return new_events
