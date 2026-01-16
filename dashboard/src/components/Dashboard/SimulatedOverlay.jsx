import React, { useState, useEffect } from 'react';
import './SimulatedOverlay.css';

const SimulatedOverlay = ({ count = 2, status = 'mixed' }) => {
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        // Create initial random boxes
        const newBoxes = Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: 20 + Math.random() * 60, // Keep central
            y: 20 + Math.random() * 50,
            w: 10 + Math.random() * 10,
            h: 20 + Math.random() * 15,
            isSafe: status === 'safe' ? true : (status === 'danger' ? false : Math.random() > 0.3)
        }));
        setBoxes(newBoxes);

        // Animate positions slightly
        const interval = setInterval(() => {
            setBoxes(prev => prev.map(box => ({
                ...box,
                x: Math.max(5, Math.min(85, box.x + (Math.random() - 0.5) * 4)),
                y: Math.max(5, Math.min(80, box.y + (Math.random() - 0.5) * 4))
            })));
        }, 1000);

        return () => clearInterval(interval);
    }, [count, status]);

    return (
        <div className="ai-overlay">
            {boxes.map(box => (
                <div
                    key={box.id}
                    className={`sim-box ${box.isSafe ? 'safe' : 'danger'}`}
                    style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.w}%`,
                        height: `${box.h}%`
                    }}
                >
                    <div className="sim-label">
                        {box.isSafe ? `ID:${100 + box.id} SAFE 98%` : `ID:${100 + box.id} VIOLATION 87%`}
                    </div>
                </div>
            ))}
        </div>
    );
};
export default SimulatedOverlay;
