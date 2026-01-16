import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import SafetyWidget from './components/Dashboard/SafetyWidget';
import FloorMap from './components/Dashboard/FloorMap';
import CameraFeed from './components/Dashboard/CameraFeed';
import LogsViewer from './components/Dashboard/LogsViewer';
import './App.css';

function App() {
    const [activeView, setActiveView] = useState('dashboard');
    const [stats, setStats] = useState({
        active_workers: '-',
        active_alerts: '-',
        compliance_score: '-',
    });
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await fetch('http://localhost:8000/api/v1/events/stats');
                if (statsRes.ok) setStats(await statsRes.json());

                const incidentsRes = await fetch('http://localhost:8000/api/v1/events/?limit=10');
                if (incidentsRes.ok) setIncidents(await incidentsRes.json());
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Layout activeView={activeView} onNavigate={setActiveView}>
            <header className="dashboard-header">
                <div>
                    <h1 className="page-title">
                        {activeView === 'dashboard' ? 'Safety Overview' : 'System Logs'}
                    </h1>
                    <p className="page-subtitle">Real-time monitoring system active</p>
                </div>
            </header>

            {activeView === 'dashboard' ? (
                <>
                    <section className="stats-grid">
                        <SafetyWidget title="Workers Active" value={stats.active_workers} status="safe" />
                        <SafetyWidget title="Active Alerts" value={stats.active_alerts} status={stats.active_alerts > 0 ? "danger" : "safe"} unit="(last 5 min)" />
                        <SafetyWidget title="Avg. Response" value="1.2" unit="min" status="safe" trend="-0.5% vs last week" />
                        <SafetyWidget title="Compliance Score" value={stats.compliance_score} status="safe" unit="(Demo Mode)" />
                    </section>

                    <section className="main-grid">
                        <div className="map-section">
                            <FloorMap />
                        </div>
                        <div className="camera-feed-section">
                            <CameraFeed src="http://localhost:5000/video_feed" title="Main Gate Feed" />
                            <div className="incident-panel">
                                <h3>Recent Incidents</h3>
                                <ul className="incident-list">
                                    {incidents.map((incident) => (
                                        <li key={incident.id} className="incident-item">
                                            <span className="time">{new Date(incident.timestamp).toLocaleTimeString()}</span>
                                            <div className="incident-details">
                                                <span className="desc">{incident.event_type}</span>
                                                <span className="sub-desc">{incident.camera_id?.substring(0, 8)}</span>
                                            </div>
                                            <span className="badge warning">Zone A</span>
                                        </li>
                                    ))}
                                    {incidents.length === 0 && <li>No recent incidents.</li>}
                                </ul>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <section className="logs-section">
                    <LogsViewer />
                </section>
            )}
        </Layout>
    )
}

export default App;
