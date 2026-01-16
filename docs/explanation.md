# Project Explanation 📖

## The Problem
Industrial sites are dangerous. Safety officers cannot watch every camera, 24/7. Manual monitoring leads to:
1.  **Fatigue**: Humans miss events after staring at screens for hours.
2.  **Latency**: Reporting a violation often happens too late.
3.  **Data Loss**: Without automated logs, there is no data to improve safety protocols.

## The Solution: Aegis SafeGuard
We built an **AI Co-pilot** for safety officers. It doesn't sleep, and it sees everything.

### How it Works (The "Magic")
1.  **Seeing**: The camera feeds video to our computer vision engine.
2.  **Thinking**:
    *   First, we detect **People** (Are they onsite?).
    *   Second, we look for **PPE** (Are they wearing helmets/vests?).
    *   Third, we assign each person a **Unique ID**. This is crucial. It lets us say "Person #5 has been without a helmet for 10 seconds," rather than shouting "HELMET MISSING" 30 times a second.
3.  **Acting**: When a violation is confirmed, the system:
    *   Draws a Red Box on the live screen.
    *   Logs the incident to the database.
    *   Updates the "Safety Score" on the dashboard.

## Why this Architecture?
We chose a **Microservices Architecture** (separating the AI from the UI) because:
*   **Scalability**: You can run the AI on a powerful GPU server while the Dashboard runs on a cheap laptop.
*   **Reliability**: If the AI crashes, the Dashboard stays up (and shows "Signal Lost").
*   **Flexibility**: We can swap out the AI model (e.g., YOLOv8 to YOLOv9) without rewriting the specific Dashboard code.
