import React from 'react';
import CameraFeed from './CameraFeed';
import FloorMap from './FloorMap';
import './LiveOperations.css';

import SimulatedOverlay from './SimulatedOverlay';

const LiveOperations = ({ activeAlerts = [] }) => {
    const [alerts, setAlerts] = React.useState([]);

    React.useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/events/?limit=10');
                if (response.ok) {
                    const data = await response.json();
                    const formattedAlerts = data.map(event => {
                        const date = new Date(event.timestamp);
                        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                        return {
                            id: event.id,
                            type: event.metadata_?.violation ? event.metadata_.violation.toUpperCase() : 'VIOLATION',
                            cam: 'Entrance Gate',
                            time: timeStr,
                            conf: '94%', // Mock confidence
                            status: 'danger'
                        };
                    });
                    setAlerts(formattedAlerts);
                }
            } catch (error) {
                console.error("Failed to fetch alerts:", error);
            }
        };

        fetchAlerts();
        const intervalId = setInterval(fetchAlerts, 2000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="live-ops-container">
            <div className="feed-grid-area">
                <header style={{ marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0 }}>Live Operations Center</h2>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Real time surveillance from 4 active feeds
                    </p>
                </header>

                <div className="camera-grid">
                    <div className="cam-wrapper">
                        {/* Main Feed - Live AI */}
                        <CameraFeed src="http://localhost:5000/video_feed" />
                        <div className="cam-label">
                            <span>Entrance Gate (AI Active)</span>
                            <span className="zone-tag">Zone A</span>
                        </div>
                    </div>
                    <div className="cam-wrapper">
                        {/* Simulation Feed 1 */}
                        <video src="/videos/site_5.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <SimulatedOverlay count={2} status="mixed" />
                        <div className="cam-label">
                            <span>Assembly Line</span>
                            <span className="zone-tag">Zone B</span>
                        </div>
                    </div>
                    <div className="cam-wrapper">
                        {/* Simulation Feed 2 */}
                        <video src="/videos/site_4.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <SimulatedOverlay count={2} status="danger" />
                        <div className="cam-label">
                            <span>Loading Dock</span>
                            <span className="zone-tag">Zone C</span>
                        </div>
                    </div>
                    <div className="cam-wrapper">
                        {/* Simulation Feed 3 */}
                        <video src="/videos/site_6.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <SimulatedOverlay count={1} status="safe" />
                        <div className="cam-label">
                            <span>Storage Aisle</span>
                            <span className="zone-tag">Zone D</span>
                        </div>
                    </div>
                </div>

                <div className="integrations-area" style={{ height: '300px' }}>
                    {/* Integrate Floor Map here as requested */}
                    <FloorMap />
                </div>
            </div>

            <aside className="alerts-sidebar">
                <div className="alerts-header">
                    <h3>Safety Alerts</h3>
                    <p>Real-time detection log</p>
                </div>
                <div className="alerts-list">
                    {alerts.length === 0 ? (
                        <div style={{ padding: '1rem', color: 'gray', textAlign: 'center', fontSize: '0.9rem' }}>
                            Waiting for active detections...
                        </div>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert.id} className={`alert-card ${alert.status}`}>
                                <div className="alert-top">
                                    <span className="alert-title">{alert.type}</span>
                                    <span className="alert-time">{alert.time}</span>
                                </div>
                                <div className="alert-details">
                                    <span>{alert.cam}</span>
                                    <span>{alert.conf} Conf</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </div>
    );
};

export default LiveOperations;
