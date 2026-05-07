import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: "/img1.jpg",
      title: "AI Fire Risk Prediction",
      subtitle: "Machine Learning Analysis",
      description: "Evaluate real-time fire probability for any coordinate."
    },
    {
      image: "/img2.jpg",
      title: "Spread Simulation",
      subtitle: "Cellular Automata Logic",
      description: "Visualize a high-fidelity 12-hour fire spread forecast based on wind vectors and terrain slope dynamics."
    },
    {
      image: "/img3.jpg",
      title: "Live Weather and land Monitoring",
      subtitle: "Integrated Stations",
      description: "Track fluctuating weather and land data via high-frequency global weather station integration."
    },
    {
      image: "/img4.jpg",
      title: "Emergency Response",
      subtitle: "Helplines & Protocols",
      description: "Immediate access to critical emergency contacts and state-authorized safety manuals during peak high-risk detection."
    },
    {
      image: "/img5.jpg",
      title: "Advanced Analytics",
      subtitle: "Historical Data Patterns",
      description: "Access detailed historical fire mapping and data visualization."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds for better reading time
    return () => clearInterval(interval);
  }, [slides.length]);

  // Auth Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:4000/check-auth", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.status) setUser(data.user);
        else setUser(null);
      } catch {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const handleStartAnalysis = () => {
    if (!user) {
      setShowAuthPopup(true);
    } else {
      navigate("/input", { state: { isGuest: false } });
    }
  };

  const handleGuestMode = () => {
    setShowAuthPopup(false);
    navigate("/input", { state: { isGuest: true } });
  };

  return (
    <div className="homepage-wrapper">
      <div className="hero">
        <div className="slider">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
            >
              <div
                className="slide-bg"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="vignette-overlay"></div>
              </div>

              <div className="slide-content">
                <div className="slide-left">
                  <h1>
                    {slide.title} <br />
                    <span>{slide.subtitle}</span>
                  </h1>
                  <p>{slide.description}</p>
                  <div className="hero-buttons">
                    <button onClick={handleStartAnalysis} className="btn-primary">
                      🔥 START ANALYSIS
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="slider-controls">
             <div className="slide-indicators">
                {slides.map((_, idx) => (
                   <span 
                    key={idx} 
                    className={`dot ${idx === currentSlide ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(idx)}
                   ></span>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* --- AUTH POPUP --- */}
      {showAuthPopup && (
        <div className="auth-overlay">
          <div className="auth-modal">
            <h3>Continue to Analysis</h3>
            <p style={{ color: "#aaa", fontSize: "14px", marginBottom: "20px" }}>
              Log in to save your history or continue as a guest.
            </p>

            <button className="auth-btn login-btn" onClick={() => navigate("/login")}>
              Login
            </button>

            <button className="auth-btn signup-btn" onClick={() => navigate("/signup")}>
              Sign Up
            </button>

            <div className="divider">OR</div>

            <button className="auth-btn guest-btn" onClick={handleGuestMode}>
              Continue as Guest
            </button>

            <button className="cancel-link" onClick={() => setShowAuthPopup(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}