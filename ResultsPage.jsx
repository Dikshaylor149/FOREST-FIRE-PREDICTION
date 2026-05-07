import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
} from "react-leaflet";
import Draggable from "react-draggable";
import Navbar from "../components/Navbar";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";
import "../styles/ResultsPage.css";

// --- Leaflet Icon Fix ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Sub-Component: Heatmap Layer ---
// --- Sub-Component: Heatmap Layer ---
function HeatmapLayer({ data, riskLevel, isSimulation }) {
    const map = useMap();
    const layerRef = useRef(null);

    useEffect(() => {
        const points = data.map((p) => [p.lat, p.lon, p.risk || p.intensity || 1.0]);

        // 🎯 SYNC: Simple Logic Gradients locked to Risk Assessment
        // This ensures overlapping map points NEVER mathematically trigger a 'false red'
        
        // At Hour 0 (Risk Map)
        const riskGradient = { 
            0.00: "#00ff41", // Edge is always Green
            0.50: (riskLevel === "LOW" || riskLevel === "NO RISK") ? "#00ff41" : "#ffc107", // Mid is Yellow for Mod/High
            0.80: riskLevel === "HIGH" ? "#ff3131" : (riskLevel === "MODERATE" ? "#fa8231" : "#00ff41"), // Core tops out at Orange for Mod
            1.00: riskLevel === "HIGH" ? "#ff3131" : (riskLevel === "MODERATE" ? "#fa8231" : "#00ff41")
        };

        // Hour 1+ (Burning Simulation)
        const burningGradient = { 
            0.00: "#00ff41",
            0.50: (riskLevel === "LOW" || riskLevel === "NO RISK") ? "#00ff41" : "#fed330",
            0.80: riskLevel === "HIGH" ? "#fa8231" : (riskLevel === "MODERATE" ? "#fa8231" : "#00ff41"),
            1.00: riskLevel === "HIGH" ? "#eb3b5a" : (riskLevel === "MODERATE" ? "#fa8231" : "#00ff41") 
        };

        if (layerRef.current) {
            // ✅ Fix: Force absolute intensity scale and update on isSimulation change
            const activeGradient = isSimulation ? burningGradient : riskGradient;
            
            layerRef.current.setOptions({ 
                gradient: activeGradient,
                max: 1.0 
            });
            layerRef.current.setLatLngs(points);
        } else {
            const activeGradient = isSimulation ? burningGradient : riskGradient;
            layerRef.current = L.heatLayer(points, {
                radius: 25, 
                blur: 15,
                max: 1.0, 
                maxZoom: 10,
                gradient: activeGradient,
            }).addTo(map);
        }
    }, [data, map, riskLevel, isSimulation]); 

    return null;
}

// --- Sub-Component: Recenter Map ---
function RecenterButton({ lat, lo }) {
    const map = useMap();
    return (
        <button className="recenter-tool" onClick={() => map.flyTo([lat, lo], 12)}>
            🎯
        </button>
    );
}

export default function ResultsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const initialFeatures = location.state?.features;

    // State for Prediction & Grid
    const [prediction, setPrediction] = useState(initialFeatures || null);
    const [heatmapData, setHeatmapData] = useState([]);
    const [fullTimeseries, setFullTimeseries] = useState([]);

    // State for Animation
    const [currentStep, setCurrentStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [displayProb, setDisplayProb] = useState(0);
    const [loading, setLoading] = useState(!initialFeatures);

    const nodeRefCard = useRef(null);
    const nodeRefHud = useRef(null);

    const lat = parseFloat(searchParams.get("lat")) || 20.2961;
    const lo = parseFloat(searchParams.get("lo")) || 84.8245;

    const fireRisk = (prediction?.risk || searchParams.get("risk") || "LOW").toUpperCase();

    // 1. Unified Data Fetch
    useEffect(() => {
        const fetchAllData = async () => {
            if (!prediction) setLoading(true);
            try {
                // Fetch Single Point Prediction if not available
                let predData = prediction;
                if (!predData) {
                    const predRes = await fetch("http://localhost:5000/predict", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ latitude: lat, longitude: lo }),
                    });
                    predData = await predRes.json();
                    setPrediction(predData);
                }
                // Fetch Grid & Simulation (MOVED TO BUTTON CLICK)
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [lat, lo]);

    useEffect(() => {
        let interval = null;
        if (isAnimating && fullTimeseries.length > 0) {
            interval = setInterval(() => {
                setCurrentStep((prev) => {
                    const next = prev + 1;
                    if (next >= fullTimeseries.length) {
                        setIsAnimating(false);
                        return prev;
                    }
                    return next;
                });
            }, 800); // 🚀 Slightly faster for better 'engaging' feel
        }
        return () => clearInterval(interval);
    }, [isAnimating, fullTimeseries.length]); // 🎯 Simplified deps to avoid unintended auto-pauses

    // 3. Update Heatmap when step changes
    useEffect(() => {
        if (fullTimeseries[currentStep]) {
            setHeatmapData(fullTimeseries[currentStep].data);
        }
    }, [currentStep, fullTimeseries]);

    // 4. Score Counter Animation
    useEffect(() => {
        if (!prediction) return;
        let start = 0;
        const target = Math.floor(prediction.fire_probability * 100);
        const counter = setInterval(() => {
            if (start >= target) {
                setDisplayProb(target);
                clearInterval(counter);
            } else {
                start += 1;
                setDisplayProb(start);
            }
        }, 20);
        return () => clearInterval(counter);
    }, [prediction]);

    const safetyInfo = useMemo(() => {
        if (heatmapData.length === 0 || !prediction) return { dist: "..." };

        // If the current prediction is already LOW risk, distance is 0
        if (prediction.risk.toUpperCase() === "LOW") {
            return { dist: "0.00" };
        }

        const getDist = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = ((lat2 - lat1) * Math.PI) / 180;
            const dLon = ((lon2 - lon1) * Math.PI) / 180;
            const a = Math.sin(dLat / 2) ** 2 + 
                      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
            return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
        };

        // Find the point in the grid with the lowest risk
        const safest = heatmapData.reduce((prev, curr) => curr.risk < prev.risk ? curr : prev);
        return { dist: getDist(lat, lo, safest.lat, safest.lon).toFixed(2) };
    }, [heatmapData, lat, lo, prediction]);


    if (loading) {
        return (
            <div className="loading-doodle-overlay">
                <div className="hex-grid"></div>
                
                <div className="robot-satellite-container">
                    <div className="robot-head">
                        <div className="robot-antenna"></div>
                    </div>
                    <div className="satellite-wrapper">
                        <div className="satellite-body">
                            <div className="solar-panel left"></div>
                            <div className="solar-panel right"></div>
                        </div>
                    </div>
                </div>

                <div className="analysis-console">
                    <div className="console-header">
                        <span className="console-title">SATELLITE DOWNLINK ACTIVE</span>
                        <div className="console-dots"><span></span><span></span><span></span></div>
                    </div>
                    <div className="console-logs">
                        <p className="log-line delay-1">{'>'} ESTABLISHING SECURE PROTOCOL...</p>
                        <p className="log-line delay-2">{'>'} CONNECTION HANDSHAKE SUCCESSFUL</p>
                        <p className="log-line delay-3">{'>'} CALIBRATING SENSORS AT ({lat.toFixed(4)}, {lo.toFixed(4)})</p>
                        <p className="log-line highlight delay-4">{'>'} ANALYZING FOREST FUEL DENSITY...</p>
                    </div>
                </div>

                <div className="progress-status-container">
                    <h2 className="loading-text">SCANNING TERRAIN...</h2>
                    <div className="progress-bar-mini">
                        <div className="progress-fill shadow-green"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <div className="nav-container-fixed">
                <Navbar />
            </div>

            <div className="main-viewport">
                {/* HUD: Safe Zone (Only show for HIGH risk & if simulation started) */}
                {fullTimeseries.length > 0 && fireRisk === "HIGH" && (
                    <Draggable nodeRef={nodeRefHud} bounds="parent">
                        <div className="top-safe-hud draggable-element" ref={nodeRefHud}>
                            <div className="hud-content">
                                <span className="hud-dot"></span>
                                <span className="hud-label">NEAREST SAFE ZONE:</span>
                                <span className="hud-value">{safetyInfo.dist}</span>
                                <span className="hud-unit">KM</span>
                            </div>
                        </div>
                    </Draggable>
                )}

                {/* TIME CONTROLLER (Predict Spread Box) */}
                {prediction && (
                    <div className="time-controls-overlay">
                        <div className="glass-panel-control">
                            <button className="play-btn" onClick={async () => {
                                if (fullTimeseries.length === 0) {
                                    // 🚀 Processing simulation on-demand as requested
                                    setIsProcessing(true);
                                    try {
                                        const res = await fetch("http://localhost:5000/predict-grid", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ latitude: lat, longitude: lo }),
                                        });
                                        const gridData = await res.json();
                                        if (gridData.status === "success") {
                                            setFullTimeseries(gridData.timeseries);
                                            setHeatmapData(gridData.initial);
                                            // Start simulation after processing
                                            setTimeout(() => {
                                                setIsProcessing(false);
                                                setIsAnimating(true);
                                            }, 1000); 
                                        }
                                    } catch (err) {
                                        console.error("Simulation failed", err);
                                        setIsProcessing(false);
                                    }
                                } else if (!isAnimating && (currentStep === 0 || currentStep >= fullTimeseries.length - 1)) {
                                    // 🚀 Replay instantly if data already exists
                                    if (currentStep >= fullTimeseries.length - 1) setCurrentStep(0);
                                    setIsAnimating(true);
                                } else {
                                    setIsAnimating(!isAnimating);
                                }
                            }}>
                                {isProcessing ? "📡 PROCESSING..." : isAnimating ? "⏸ PAUSE SIM" : "▶ PREDICT SPREAD"}
                            </button>
                            
                            {fullTimeseries.length > 0 && (
                                <div className="step-info">
                                    <span>FORECAST: T + {currentStep}h</span>
                                    <input
                                        type="range" min="0" max={fullTimeseries.length - 1}
                                        value={currentStep} onChange={(e) => { setIsAnimating(false); setCurrentStep(parseInt(e.target.value)); }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <MapContainer center={[lat, lo]} zoom={10} className="full-screen-map" zoomControl={false}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    {/* Pass the risk status here */}
                    {heatmapData.length > 0 && (
                        <HeatmapLayer
                            data={heatmapData}
                            riskLevel={fireRisk}
                            isSimulation={currentStep > 0}
                        />
                    )}

                    <Marker position={[lat, lo]}>
                        <Popup><b>Analysis Point</b><br />Risk: {fireRisk}</Popup>
                    </Marker>

                    {/* Recenter Tool */}
                    <RecenterButton lat={lat} lo={lo} />
                </MapContainer>

                {/* Sidebar: Satellite Audit */}
                <Draggable nodeRef={nodeRefCard} handle=".drag-handle" bounds="parent">
                    <div className="floating-sidebar draggable-element" ref={nodeRefCard}>
                        <div className="audit-card">
                            <header className="audit-header drag-handle">
                                <span className="live-dot"></span>
                                <h3>SATELLITE AUDIT</h3>
                            </header>
                            <div className="audit-content">
                                <div className="prob-circle-zone">
                                    <svg width="220" height="220" className="radial-svg">
                                        <circle className="r-bg" cx="110" cy="110" r={85} />
                                        <circle className="r-progress" cx="110" cy="110" r={85}
                                            style={{
                                                strokeDasharray: 534,
                                                strokeDashoffset: 534 - (displayProb / 100) * 534,
                                                stroke: fireRisk === "HIGH" ? "#f10505" : fireRisk === "MODERATE" ? "#ffc107" : "#00ff41",
                                            }}
                                        />
                                    </svg>
                                    <div className="prob-label-wrap">
                                        <h1 className="prob-val">{displayProb}%</h1>
                                        <span className="prob-sub">PROBABILITY</span>
                                    </div>
                                </div>
                                <div className={`risk-badge-flat ${(fireRisk === "LOW" || fireRisk === "NO RISK") ? "low" : fireRisk.toLowerCase()}`}>{fireRisk} RISK DETECTED</div>
                                <div className="metrics-grid">
                                    <div className="metric-box"><span className="m-title">LATITUDE</span><span className="m-val">{lat.toFixed(4)}°</span></div>
                                    <div className="metric-box"><span className="m-title">LONGITUDE</span><span className="m-val">{lo.toFixed(4)}°</span></div>
                                </div>
                                <div className="audit-actions" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button className="btn-action-primary" onClick={() => navigate("/input")}>NEW ANALYSIS</button>
                                    
                                    {fireRisk === "HIGH" && (
                                        <button 
                                            className="btn-helpline-alert" 
                                            onClick={() => navigate("/helpline")}
                                        >
                                            🚨 EMERGENCY HELPLINE
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Draggable>

                {fullTimeseries.length > 0 && (
                    <div className="floating-legend">
                        <div className="leg-item"><span className="dot low"></span> Low</div>
                        <div className="leg-item"><span className="dot mid"></span> Moderate</div>
                        <div className="leg-item"><span className="dot high"></span> High</div>
                    </div>
                )}

                {isProcessing && (
                    <div className="propagation-overlay">
                        <div className="prop-card">
                            <div className="hud-scanner-container" style={{ transform: 'scale(0.8)', marginBottom: '0' }}>
                                <div className="radar-circle">
                                    <div className="scanning-beam"></div>
                                    <div className="scanning-line"></div>
                                </div>
                                <div className="marker-pings">
                                    <div className="ping p1"></div>
                                    <div className="ping p2"></div>
                                    <div className="ping p3"></div>
                                </div>
                            </div>
                            
                            <h2 className="prop-title" style={{ marginTop: '10px' }}>Analyzing Forecast</h2>
                            <div className="prop-progress-wrap">
                                <div className="prop-progress-bar"></div>
                            </div>
                            <div className="prop-logs">
                                <div className="prop-log-line p-delay-1">CALCULATING WIND VECTORS... {prediction?.features?.wind_speed?.toFixed(1)} m/s</div>
                                <div className="prop-log-line p-delay-2">MAPPING RADIUS AT ({lat.toFixed(2)}, {lo.toFixed(2)})</div>
                                <div className="prop-log-line p-delay-3">SIMULATING CELLULAR AUTOMATA...</div>
                                <div className="prop-log-line p-delay-4">12-HOUR TIMELINE GENERATED.</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}