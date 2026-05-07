import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import "../styles/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
const isGuest = location.state?.isGuest ?? true;
  const [user, setUser] = useState(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:4000/check-auth", {
        credentials: "include",
      });

      const data = await res.json();

      if (data.status) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed");
      setUser(null);
    }
  };

  checkAuth();
}, []);


  // 🔥 When user clicks Check Fire Risk
  // const handleStartAnalysis = () => {
  //   if (!user) {
  //     setShowAuthPopup(true); // show popup only after click
  //   } else {
  //     navigate("/input", { state: { isGuest: false, user: user} });
  //   }
  // };
  const handleStartAnalysis = () => {
  if (!user) {
    setShowAuthPopup(true);
  } else {
    // ⚠️ CRITICAL: Make sure 'user' here is the one from your useEffect/Auth check
    console.log("Navigating with user:", user); 
    navigate("/input", { 
      state: { 
        isGuest: false, 
        user: user // This must contain the 'id' seen in your logs
      } 
    });
  }
};

  const handleGuestMode = () => {
    setShowAuthPopup(false);
    navigate("/input", { state: { isGuest: true } });
  };

  return (
    <div className="home-container">
      <Navbar />

      <section className="hero-full-viewport">
        <div className="hero-bg-wrapper">
          <img
            src="https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&q=80&w=2000"
            className="hero-img-animated"
            alt="Forest"
          />
          <div className="hero-overlay-dark"></div>
        </div>

        <div className="hero-content-layer">
          <div className="ai-badge-floating">✨ AI-Powered Forest Guard</div>
          <h1 className="hero-display-title">
            <span className="text-white">Protect Our</span>
            <br />
            <span className="text-fire-glow">Forests</span>
            <br />
            <span className="text-emerald-glow">From Wildfires</span>
          </h1>

          <button className="btn-fire-pulse" onClick={handleStartAnalysis}>
            🔥 Check Fire Risk Now
          </button>
        </div>

        <div className="bottom-curve-divider"></div>
      </section>

      {/* 🔐 AUTH POPUP (only appears after click) */}
      {showAuthPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#111",
              padding: "35px",
              borderRadius: "16px",
              textAlign: "center",
              width: "320px",
              boxShadow: "0 0 25px rgba(0,0,0,0.6)",
            }}
          >
            <h3 style={{ color: "white", marginBottom: "20px" }}>
              Continue to Analysis
            </h3>

            <button
              onClick={() => navigate("/login")}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "12px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Sign Up
            </button>

            <button
              onClick={handleGuestMode}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Continue as Guest
            </button>

            <button
              onClick={() => setShowAuthPopup(false)}
              style={{
                marginTop: "15px",
                background: "none",
                border: "none",
                color: "#aaa",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <section className="features-compact-section" id="features">
        <div className="features-max-width">
          <h2 className="section-title-center">
            Intelligent <span className="text-orange">Insights</span>
          </h2>
          <div className="features-4-grid">
            {[
              {
                title: "Location Analysis",
                desc: "Instant coordinate tracking.",
                img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=400",
                grad: "linear-gradient(to br, #22c55e, #059669)",
              },
              {
                title: "AI Predictions",
                desc: "Neural network data processing.",
                img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400",
                grad: "linear-gradient(to br, #f97316, #dc2626)",
              },
              {
                title: "Real-Time Stats",
                desc: "Live telemetry heat maps.",
                img: "https://media.istockphoto.com/id/2207584622/photo/automated-reporting-and-business-intelligence-data-automation-and-dashboards-businessman.jpg?s=612x612&w=0&k=20&c=5zbQe2v3-yDQc9Ual_Y583USJbGlNcfHz0iuKIs-dYE=",
                grad: "linear-gradient(to br, #eab308, #f97316)",
              },
              {
                title: "Community Safety",
                desc: "Risk alerts for local groups.",
                img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=400",
                grad: "linear-gradient(to br, #ef4444, #db2777)",
              },
            ].map((f, i) => (
              <FeatureCard
                key={i}
                title={f.title}
                description={f.desc}
                img={f.img}
                gradient={f.grad}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
