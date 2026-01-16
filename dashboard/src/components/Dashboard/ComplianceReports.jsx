import React from 'react';
import SafetyWidget from './SafetyWidget';

const ComplianceReports = () => {
    const [stats, setStats] = React.useState({
        activeComponents: 0,
        activeAlerts: 0,
        complianceScore: '100%',
        totalDetections: 0
    });
    const [topViolation, setTopViolation] = React.useState('None');
    const [distributions, setDistributions] = React.useState([]);
    const [trends, setTrends] = React.useState([]);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch('http://localhost:8000/api/v1/events/stats');
                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    setStats({
                        activeComponents: statsData.active_workers,
                        activeAlerts: statsData.active_alerts,
                        complianceScore: statsData.compliance_score,
                        totalDetections: statsData.total_detections || 0
                    });
                }

                // Fetch Recent Events for Top Violation
                const eventsRes = await fetch('http://localhost:8000/api/v1/events/?limit=50');
                if (eventsRes.ok) {
                    const events = await eventsRes.json();
                    if (events.length > 0) {
                        const violations = events.filter(e => e.event_type !== 'safe' && e.metadata_?.violation);

                        if (violations.length > 0) {
                            // Top Violation Logic
                            const counts = {};
                            violations.forEach(v => {
                                const type = v.metadata_.violation;
                                counts[type] = (counts[type] || 0) + 1;
                            });
                            const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
                            setTopViolation(top);

                            // Distribution Logic
                            const total = violations.length;
                            const distData = Object.entries(counts).map(([type, count]) => ({
                                type: type,
                                percent: Math.round((count / total) * 100)
                            })).sort((a, b) => b.percent - a.percent);
                            setDistributions(distData);

                            // Trends Logic (Activity per minute for last 10 events to show movement)
                            // Since we have limited data, let's just use the last 12 events arrival time
                            // To simulate a "trend", we can bucket them by 10-second intervals or just plot recent density
                            // Simpler: Map the last 12 events to bar heights based on something random but deterministic or just counts
                            // Better: Bucket by minute
                            const now = new Date();
                            const timeBuckets = new Array(12).fill(0);
                            events.forEach(e => {
                                const diff = (now - new Date(e.timestamp)) / 1000; // seconds
                                const bucket = Math.floor(diff / 10); // 10s buckets
                                if (bucket < 12) {
                                    timeBuckets[11 - bucket] += 1;
                                }
                            });
                            // Normalize for visual height (0-100%)
                            const max = Math.max(...timeBuckets, 1);
                            const trendData = timeBuckets.map(c => (c / max) * 100);
                            setTrends(trendData);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch report data", err);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: '2rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>Safety Compliance Report</h1>
                <p style={{ color: 'var(--text-muted)' }}>Analysis of PPE adherence across all active zones.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <SafetyWidget title="Avg Compliance" value={stats.complianceScore} status={parseInt(stats.complianceScore) > 90 ? "safe" : "warning"} unit="Real-time" />
                <SafetyWidget title="Total Detections" value={stats.totalDetections.toLocaleString()} status="warning" unit="Last 5m" />
                <SafetyWidget title="Active Alerts" value={stats.activeAlerts} status={stats.activeAlerts === 0 ? "safe" : "danger"} unit="Current" />
                <SafetyWidget title="Top Violation" value={topViolation} status="danger" unit="Most Frequent" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', height: '400px' }}>
                <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Violation Trends (Real-time)</h3>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '2%', paddingBottom: '20px', borderBottom: '1px solid var(--border)' }}>
                        {/* CSS Bar Chart Mock */}
                        {trends.length > 0 ? trends.map((h, i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: `${h || 10}%`, // Min height 10% for visibility
                                background: 'linear-gradient(to top, var(--primary), transparent)',
                                borderRadius: '4px 4px 0 0',
                                opacity: 0.8,
                                transition: 'height 0.5s ease'
                            }}></div>
                        )) : (
                            <div style={{ width: '100%', textAlign: 'center', color: 'gray' }}>Waiting for data...</div>
                        )}
                    </div>
                </div>

                <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border)' }}>
                    <h3 style={{ margin: '0 0 1rem 0' }}>Violation Distribution</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {distributions.length > 0 ? distributions.map((dist, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span>{dist.type}</span>
                                    <span>{dist.percent}%</span>
                                </div>
                                <div style={{ height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${dist.percent}%`, height: '100%', background: i === 0 ? 'var(--danger)' : 'var(--warning)' }}></div>
                                </div>
                            </div>
                        )) : (
                            <div style={{ color: 'gray' }}>No violation data available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ComplianceReports;
