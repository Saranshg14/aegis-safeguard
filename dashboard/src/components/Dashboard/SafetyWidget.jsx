import React from 'react';

const SafetyWidget = ({ title, value, status, unit, trend, icon }) => {
    const statusColor = status === 'danger' ? '#ff4444' : status === 'warning' ? '#ffbb33' : '#00C851';

    return (
        <div className="safety-widget" style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>{title}</span>
                {icon && <span style={{ color: '#666' }}>{icon}</span>}
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: statusColor, lineHeight: 1 }}>
                {value} <span style={{ fontSize: '1rem', color: '#666', fontWeight: 400 }}>{unit}</span>
            </div>
            {trend && <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: statusColor }}>{trend}</div>}
        </div>
    );
};

export default SafetyWidget;
