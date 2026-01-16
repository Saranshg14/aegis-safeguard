# Run AI on Local Webcam (Bypass Docker Isolation)

Write-Host "🛡️  Stopping Docker Container (to free up port 5000)..." -ForegroundColor Cyan
docker stop iithackathon-ppe_monitor-1

Write-Host "📦  Installing Dependencies (this might take a minute)..." -ForegroundColor Cyan
pip install -r ppe_monitor/requirements.txt

Write-Host "⚙️  Configuring Environment..." -ForegroundColor Cyan
$env:BACKEND_URL = "http://localhost:8000/api/v1"

Write-Host "🎥  Starting AI with Webcam (Close window to stop)..." -ForegroundColor Green
cd ppe_monitor
python main.py --source 0
