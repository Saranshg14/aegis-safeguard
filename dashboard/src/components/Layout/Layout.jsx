import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children, activeView, onNavigate }) => {
    return (
        <div className="layout">
            <Sidebar activeView={activeView} onNavigate={onNavigate} />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
