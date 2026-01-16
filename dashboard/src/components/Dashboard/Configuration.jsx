import React from 'react';

const Configuration = () => {
    const [config, setConfig] = React.useState({
        threshold: 0.6,
        persistentLogging: true,
        email: 'admin@example.com',
        webhook: 'https://hooks.slack.com/...'
    });
    const [saved, setSaved] = React.useState(false);

    React.useEffect(() => {
        const savedConfig = localStorage.getItem('safeguard_config');
        if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        setSaved(false);
    };

    const handleSave = () => {
        localStorage.setItem('safeguard_config', JSON.stringify(config));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: 0 }}>System Configuration</h1>
            </header>

            <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                <h3 style={{ marginTop: 0 }}>Detection Thresholds</h3>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Confidence Threshold ({config.threshold})</label>
                    <input
                        name="threshold"
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={config.threshold}
                        onChange={handleChange}
                        style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        <span>Loose (0.1)</span>
                        <span>Strict (1.0)</span>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        name="persistentLogging"
                        type="checkbox"
                        checked={config.persistentLogging}
                        onChange={handleChange}
                    />
                    <label>Enable Persistent Logging</label>
                </div>
            </div>

            <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '2rem', border: '1px solid var(--border)' }}>
                <h3 style={{ marginTop: 0 }}>Notification Settings</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Alerts</label>
                        <input
                            name="email"
                            type="email"
                            value={config.email}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Slack Webhook</label>
                        <input
                            name="webhook"
                            type="text"
                            value={config.webhook}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-dark)', border: '1px solid var(--border)', color: 'white', borderRadius: '6px' }}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={handleSave}
                style={{ marginTop: '2rem', background: saved ? 'var(--success)' : 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.3s' }}
            >
                {saved ? 'Changes Saved' : 'Save Changes'}
            </button>
        </div>
    );
};
export default Configuration;
