import React, { useState, useEffect } from 'react';
import './LogsViewer.css';

const LogsViewer = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const limit = 20;

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const skip = page * limit;
            const res = await fetch(`http://localhost:8000/api/v1/events/?skip=${skip}&limit=${limit}`);
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Failed to fetch logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page]);

    return (
        <div className="logs-viewer">
            <div className="logs-header">
                <h2>System Logs</h2>
                <div className="logs-actions">
                    <button className="btn-secondary" onClick={fetchLogs}>Refresh</button>
                    <div className="pagination">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                        >
                            Previous
                        </button>
                        <span>Page {page + 1}</span>
                        <button
                            disabled={logs.length < limit}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <div className="logs-table-container">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Event Type</th>
                            <th>Camera</th>
                            <th>Details</th>
                            <th>Person ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center">Loading logs...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No logs found.</td></tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id}>
                                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${log.event_type === 'violation' ? 'danger' : 'neutral'}`}>
                                            {log.event_type}
                                        </span>
                                    </td>
                                    <td>{log.metadata_?.violation || 'Event'}</td>
                                    <td>{log.person_id || '-'}</td>
                                    <td>Resolved</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogsViewer;
