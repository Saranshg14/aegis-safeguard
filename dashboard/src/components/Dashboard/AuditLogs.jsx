import React from 'react';

const AuditLogs = () => {
    const [logs, setLogs] = React.useState([]);

    React.useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/events/?limit=50');
                if (response.ok) {
                    const data = await response.json();
                    const formattedLogs = data.map(event => {
                        const date = new Date(event.timestamp);
                        const timeStr = date.toLocaleString();

                        // Map event data
                        const isSafe = event.event_type === 'safe';
                        const type = event.metadata_?.violation ? `ALERT: ${event.metadata_.violation.toUpperCase()}` : (isSafe ? 'SAFE' : 'EVENT');
                        const status = isSafe ? 'safe' : 'danger';
                        const details = `Detected Person #${event.person_id || 'Unknown'}`;

                        return {
                            time: timeStr,
                            src: 'Entrance Gate', // Primary AI source
                            type: type,
                            details: details,
                            status: status
                        };
                    });
                    setLogs(formattedLogs);
                }
            } catch (error) {
                console.error("Failed to fetch logs:", error);
            }
        };

        fetchLogs();
        const interval = setInterval(fetchLogs, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ margin: 0 }}>System Audit Logs</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Track system access, configuration changes, and errors.</p>
                </div>
                <button style={{ background: 'transparent', border: '1px solid var(--border)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px' }}>Export CSV</button>
            </header>

            <div style={{ background: 'var(--bg-card)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'var(--bg-panel)', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>Timestamp</th>
                            <th style={{ padding: '1rem' }}>Source ID</th>
                            <th style={{ padding: '1rem' }}>Action Type</th>
                            <th style={{ padding: '1rem' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{log.time}</td>
                                <td style={{ padding: '1rem' }}>{log.src}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        background: log.status === 'safe' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: log.status === 'safe' ? '#10b981' : '#ef4444',
                                        fontWeight: 'bold', fontSize: '0.75rem'
                                    }}>
                                        {log.type}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{log.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default AuditLogs;
