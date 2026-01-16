import React from 'react';
import './Sidebar.css';

const Sidebar = ({ activeView, onNavigate }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon"></div>
                <h2 className="brand-name">SafeGuard</h2>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <button
                            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
                            onClick={() => onNavigate('dashboard')}
                        >
                            <span className="label">Dashboard</span>
                        </button>
                    </li>
                    <li>
                        <button
                            className={`nav-item ${activeView === 'logs' ? 'active' : ''}`}
                            onClick={() => onNavigate('logs')}
                        >
                            <span className="label">Logs</span>
                        </button>
                    </li>
                    <li>
                        <button className="nav-item">
                            <span className="label">Live Feeds</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
