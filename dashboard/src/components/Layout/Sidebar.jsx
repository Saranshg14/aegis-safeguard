import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeView, onNavigate }) => {
    const menuItems = [
        { id: 'live', label: 'Live Operations', icon: '📹' },
        { id: 'reports', label: 'Compliance Reports', icon: '📊' },
        { id: 'config', label: 'Configuration', icon: '⚙️' },
        { id: 'audit', label: 'Audit Logs', icon: '🛡️' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-logo">S</div>
                <div className="brand-text">
                    <h2>SafeGuard AI</h2>
                    <span className="version">v2.4.0-RC1</span>
                </div>
            </div>

            <div className="sidebar-section-label">MONITOR</div>
            <nav className="sidebar-nav">
                {menuItems.slice(0, 2).map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="sidebar-section-label">SYSTEM</div>
            <nav className="sidebar-nav">
                {menuItems.slice(2).map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="icon">{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="logout-section">
                <button className="nav-item logout">
                    <span className="icon">↪</span> Logout
                </button>
            </div>
        </aside>
    );
};
export default Sidebar;
