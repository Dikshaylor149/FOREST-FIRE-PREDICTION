import React, { useEffect, useState, useRef } from "react"; // 🔴 useRef added
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  // ✅ Get guest mode from route state (matches Home.jsx)
  const isGuest = location.state?.isGuest === true;

  // ✅ Check auth whenever route changes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_AUTH_API_URL || "http://localhost:4000";
        const res = await fetch(`${apiUrl}/check-auth`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (data.status) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, [location]);

  // ✅ Logout (original logic kept)
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      navigate("/");
    } catch (err) {
      console.log("Logout failed");
    }
  };

  // ✅ Protected Navigation (FIXED)
  const handleProtectedRoute = (path) => {
    if (user || isGuest) {
      navigate(path, { state: { isGuest } });
    } else {
      alert("Please login, signup, or continue as Guest to access this page.");
      navigate("/");
    }
  };

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark forest-navbar" 
      style={{ position: "absolute", top: 0, left: 0, width: "100%", zIndex: 1030 }}
    >
      <div className="container-fluid">

        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img src="/logo.png" alt="ForestGuard Logo" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
          <span>ForestGuard</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => handleProtectedRoute("/analytics")}
              >
                Analytics
              </button>
            </li>

            <li className="nav-item">
              <button
                className="nav-link btn btn-link"
                onClick={() => handleProtectedRoute("/helpline")}
              >
                Helpline
              </button>
            </li>
          </ul>

          <ul className="navbar-nav">
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Hello, {user.username}
                  </span>
                </li>

                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="nav-link btn btn-link"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Log In</Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">Sign Up</Link>
                </li>
              </>
            )}
          </ul>

        </div>
      </div>
    </nav>
  );
}