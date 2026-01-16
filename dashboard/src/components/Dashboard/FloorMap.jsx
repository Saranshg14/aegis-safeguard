import React, { useState, useEffect } from 'react';
import './FloorMap.css';

const FloorMap = () => {
    // Simulate workers moving
    const [workers, setWorkers] = useState([
        { id: 1, x: 20, y: 30, status: 'safe' },
        { id: 2, x: 50, y: 50, status: 'safe' },
        { id: 3, x: 70, y: 20, status: 'risk' }, // One violation
        { id: 4, x: 80, y: 80, status: 'safe' },
        { id: 5, x: 30, y: 70, status: 'safe' },
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setWorkers(prev => prev.map(w => ({
                ...w,
                x: Math.max(10, Math.min(90, w.x + (Math.random() - 0.5) * 5)),
                y: Math.max(10, Math.min(90, w.y + (Math.random() - 0.5) * 5))
            })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="floor-map-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Live Floor Status</h3>
                <div className="map-legend">
                    <div className="legend-item">
                        <span className="dot-sample" style={{ background: '#00C851' }}></span> Safe
                    </div>
                    <div className="legend-item">
                        <span className="dot-sample" style={{ background: '#ff4444' }}></span> Risk
                    </div>
                </div>
            </div>

            <div className="map-viz">
                {/* Zones Overlay */}
                <div className="zone-label" style={{ top: '10%', left: '10%', width: '40%', height: '40%' }}>
                    ZONE A
                </div>
                <div className="zone-label" style={{ bottom: '10%', right: '10%', width: '40%', height: '40%' }}>
                    ZONE B
                </div>

                {/* Workers */}
                {workers.map(w => (
                    <div
                        key={w.id}
                        className={`worker-dot ${w.status}`}
                        style={{ left: `${w.x}%`, top: `${w.y}%` }}
                    />
                ))}
            </div>
        </div>
    );
};
export default FloorMap;
