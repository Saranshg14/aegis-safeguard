import React, { useState, useEffect } from 'react';
import './CameraFeed.css';

const CameraFeed = ({ src = "http://localhost:5000/video_feed" }) => {
    const [status, setStatus] = useState('connecting'); // connecting, live, error
    const [retryCount, setRetryCount] = useState(0);
    const [videos, setVideos] = useState([]);
    const [currentVideo, setCurrentVideo] = useState("");
    const [isWebcam, setIsWebcam] = useState(false);

    // Fetch available videos
    useEffect(() => {
        fetch('http://localhost:5000/videos')
            .then(res => res.json())
            .then(data => {
                // Add "Webcam (Local)" option to the list
                const allSources = [...(data.videos || []), "Webcam (Local)"];
                setVideos(allSources);
                setCurrentVideo(data.current || "");
            })
            .catch(err => console.error("Failed to fetch videos:", err));
    }, []);

    const handleSourceChange = (e) => {
        const newSource = e.target.value;
        setCurrentVideo(newSource);
        setStatus('connecting');

        if (newSource === "Webcam (Local)") {
            setIsWebcam(true);
            setStatus('live'); // Webcam activates immediately
        } else {
            setIsWebcam(false);
            fetch('http://localhost:5000/change_source', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ source: newSource })
            })
                .then(res => res.json())
                .then(() => {
                    setTimeout(() => {
                        setRetryCount(prev => prev + 1);
                    }, 1000);
                })
                .catch(err => {
                    console.error("Failed to switch source:", err);
                    setStatus('error');
                });
        }
    };

    const handleLoad = () => { setStatus('live'); };
    const handleError = () => { setStatus('error'); };
    const handleRetry = () => {
        if (!isWebcam) {
            setStatus('connecting');
            setRetryCount(prev => prev + 1);
        }
    };

    const WebcamView = () => {
        const videoRef = React.useRef(null);
        useEffect(() => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(err => {
                    console.error("Webcam access denied:", err);
                    setStatus('error');
                });
        }, []);
        return <video ref={videoRef} autoPlay playsInline className="video-stream visible" style={{ objectFit: 'cover' }} />;
    };

    return (
        <div className="camera-feed-card">
            <div className="camera-header-overlay">
                <div className="camera-title">
                    <span className={`status-dot ${status === 'live' ? 'pulsing' : ''}`}></span>
                    CAM {currentVideo ? currentVideo.substring(0, 8).toUpperCase() : "FEED"}
                </div>

                <div className="camera-controls">
                    {videos.length > 0 && (
                        <select
                            className="source-select"
                            value={currentVideo}
                            onChange={handleSourceChange}
                        >
                            {videos.map(v => (
                                <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="video-viewport">
                {status === 'connecting' && (
                    <div className="feed-state connecting">
                        <div className="radar-spinner"></div>
                        <p>Establishing Secure Link...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="feed-state error">
                        <div className="error-icon">⚠️</div>
                        <p>Signal Lost</p>
                        <button className="retry-btn" onClick={handleRetry}>
                            Reconnect Stream
                        </button>
                    </div>
                )}

                {isWebcam ? (
                    <WebcamView />
                ) : (
                    <img
                        key={retryCount}
                        src={src}
                        alt="Secure Live Feed"
                        className={`video-stream ${status === 'live' ? 'visible' : 'hidden'}`}
                        onLoad={handleLoad}
                        onError={handleError}
                    />
                )}
            </div>

            <div className="camera-scanlines"></div>
        </div>
    );
};
export default CameraFeed;
