import React, { useState, useEffect } from 'react';
import Layout from './components/Layout/Layout';
import LiveOperations from './components/Dashboard/LiveOperations';
import ComplianceReports from './components/Dashboard/ComplianceReports';
import Configuration from './components/Dashboard/Configuration';
import AuditLogs from './components/Dashboard/AuditLogs';
import './theme.css';
import './App.css';

function App() {
    const [activeView, setActiveView] = useState('live');
    const [stats, setStats] = useState({});

    // Keep fetching stats in background for Reports
    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await fetch('http://localhost:8000/api/v1/events/stats');
                if (statsRes.ok) setStats(await statsRes.json());
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    const renderView = () => {
        switch (activeView) {
            case 'live': return <LiveOperations />;
            case 'reports': return <ComplianceReports stats={stats} />;
            case 'config': return <Configuration />;
            case 'audit': return <AuditLogs />;
            default: return <LiveOperations />;
        }
    };

    return (
        <Layout activeView={activeView} onNavigate={setActiveView}>
            {renderView()}
        </Layout>
    )
}

export default App;
