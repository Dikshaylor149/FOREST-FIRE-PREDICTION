import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputValue;

  // ✅ Handle input changes
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  // ✅ Toast messages
  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  // ✅ Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/login",
        { ...inputValue },
        { withCredentials: true }
      );

      const { success, message, user, isVerified } = data;

      if (success) {
        // ✅ 1. Extract the unique ID (check for both .id and ._id)
        const userId = user._id || user.id;

        // ✅ 2. Construct a clean user object for the state
        const userData = {
          id: userId,
          username: user.username || user.email, // Fallback to email if username is null
          email: user.email,
          isVerified
        };

        // ✅ 3. Store in localStorage as backup for refreshes
        localStorage.setItem("user", JSON.stringify(userData));

        handleSuccess(message);

        setTimeout(() => {
          // ✅ 4. Pass the userData (WITH ID) in navigation state
          navigate("/", { state: { isGuest: false, user: userData } });
        }, 1000);
      } else {
        handleError(message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      handleError("Something went wrong. Try again.");
    }

    setInputValue({
      email: "",
      password: "",
    });
  };

  return (
    <div className="auth-page">
      <div className="form_container">
        <h2>Login Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              required
            />
          </div>

          <button type="submit">Login</button>

          <div
            style={{
              textAlign: "center",
              marginTop: "1rem",
              lineHeight: "1.5",
            }}
          >
            <span style={{ color: "black" }}>Don’t have an account? </span>
            <Link
              to="/signup"
              style={{
                color: "#28dcfc",
                textDecoration: "none",
                fontWeight: "500",
              }}
            >
              Signup
            </Link>
            <div style={{ marginTop: "0.5rem" }}>
              <Link
                to="/forgot-password"
                style={{
                  color: "#28dcfc",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;