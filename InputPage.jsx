import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as ELG from "leaflet-control-geocoder";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";

import Navbar from "../components/Navbar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/InputPage.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function MapFlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 13);
  }, [position, map]);
  return null;
}

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function MapSearch({ setLat, setLo }) {
  const map = useMap();
  useEffect(() => {
    const geocoder = ELG.geocoder({ defaultMarkGeocode: false })
      .on("markgeocode", function (e) {
        const center = e.geocode.center;
        setLat(center.lat.toFixed(6));
        setLo(center.lng.toFixed(6));
        map.flyTo(center, 13);
      })
      .addTo(map);
    return () => { if (map) map.removeControl(geocoder); };
  }, [map, setLat, setLo]);
  return null;
}

export default function InputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isGuest = location.state?.isGuest ?? true;

  const [lat, setLat] = useState("");
  const [lo, setLo] = useState("");
  const [position, setPosition] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const ODISHA_BOUNDS = { minLat: 17.8, maxLat: 22.6, minLo: 81.3, maxLo: 87.5 };

  useEffect(() => {
    const l1 = parseFloat(lat);
    const l2 = parseFloat(lo);
    if (!isNaN(l1) && !isNaN(l2)) setPosition([l1, l2]);
  }, [lat, lo]);

  const handleManualInput = (type, value) => {
    if (type === "lat") setLat(value);
    if (type === "lo") setLo(value);
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.length > 0) {
          setLat(parseFloat(data[0].lat).toFixed(6));
          setLo(parseFloat(data[0].lon).toFixed(6));
        }
      } catch (err) { console.error("Search failed", err); }
    }
  };

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setLat(e.latlng.lat.toFixed(6));
        setLo(e.latlng.lng.toFixed(6));
      },
    });
    return position ? <Marker position={position} /> : null;
  }

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLo(pos.coords.longitude.toFixed(6));
      },
      () => alert("Unable to retrieve location")
    );
  };

  const isWithinOdisha = (lat, lo) => {
    const la = parseFloat(lat);
    const ln = parseFloat(lo);
    return (
      la >= ODISHA_BOUNDS.minLat && la <= ODISHA_BOUNDS.maxLat &&
      ln >= ODISHA_BOUNDS.minLo && ln <= ODISHA_BOUNDS.maxLo
    );
  };

  const handleAnalyze = async () => {
    if (!lat || !lo) return;
    if (!isWithinOdisha(lat, lo)) return alert("Only Odisha coordinates allowed");

    setIsLoading(true);
    
    // Line 1: Initial Status
    setStatusMessage("FETCHING GEOSPATIAL DATA...");

    // Line 2: Update after 1.5 seconds
    const timer1 = setTimeout(() => {
      setStatusMessage("MODEL ANALYZING RISK FACTORS...");
    }, 1500);

    // Line 3: Update after 3 seconds
    const timer2 = setTimeout(() => {
      setStatusMessage("FINALIZING PREDICTION RESULTS...");
    }, 3000);

    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: parseFloat(lat), longitude: parseFloat(lo) }),
      });
      const data = await res.json();
      
      if (data.error) {
          clearTimeout(timer1);
          clearTimeout(timer2);
          setIsLoading(false);
          return alert(data.error);
      }

      // Small delay so the user can actually see the "Finalizing" message
      setTimeout(() => {
        navigate(`/results?lat=${lat}&lo=${lo}&risk=${data.risk}&value=${data.fire_probability}`, { state: { isGuest, features: data } });
      }, 3500);

    } catch (err) { 
      clearTimeout(timer1);
      clearTimeout(timer2);
      alert("Prediction failed"); 
      setIsLoading(false);
    }
  };

  return (
    <div className="page-layout">
      <Navbar />

      {/* --- START OF REPLACEMENT --- */}
{isLoading && (
  <div className="global-loader-overlay">
    {/* 1. Full-screen heat aura */}
    <div className="loader-amber-glow"></div>
    
    {/* 2. Full-screen digital grid */}
    <div className="loader-grid-bg-full"></div>
    
    {/* 3. The Layout (Now Transparent) */}
    <div className="loader-horizontal-layout-transparent">
      
      <div className="side-spinner-container">
        <div className="large-spinner-dual"></div>
        <div className="spinner-core-orange"></div>
      </div>
      
      <div className="loader-text-group">
        <div className="status-header">
           <h1 className="loader-status-main">{statusMessage}</h1>
           <span className="pulse-dot-orange"></span>
        </div>
      </div>
    </div>

    <div className="scanning-beam-orange"></div>
  </div>
)}
{/* --- END OF REPLACEMENT --- */}
      <div className="content-container">
        <aside className="sidebar-column">
          <div className="card-box main-input-card">
            <div className="card-orange-header">
              <span>📍</span>
              <h2>Coordinates</h2>
            </div>

            <div className="card-content-padding">
              <div className="inputs-wrapper">
                <div className="input-group">
                  <label>LATITUDE</label>
                  <input type="number" value={lat} placeholder="Enter Latitude..." onChange={(e) => handleManualInput("lat", e.target.value)} />
                </div>
                <div className="input-group">
                  <label>LONGITUDE</label>
                  <input type="number" value={lo} placeholder="Enter Longitude..." onChange={(e) => handleManualInput("lo", e.target.value)} />
                </div>
              </div>

              <div className="buttons-wrapper">
                <button className="btn-orange-action" onClick={handleAnalyze} disabled={isLoading}>🔥 ANALYSE RISK</button>
                <button className="btn-orange-action" onClick={handleCurrentLocation} disabled={isLoading}>📍 USE CURRENT LOCATION</button>
              </div>
            </div>
          </div>
        </aside>

        <main className="map-column">
          <div className="map-card-container">
            <div className="horizontal-search-bar">
              <div className="search-pill">
                <span>🔍</span>
                <input type="text" placeholder="Search on Map..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} />
              </div>
            </div>
            <div className="map-wrapper-inner">
              <MapContainer center={[20.5937, 78.9629]} zoom={5} className="leaflet-full-height">
                <MapResizer />
                <MapFlyTo position={position} />
                <MapSearch setLat={setLat} setLo={setLo} />
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                <LocationMarker />
              </MapContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}