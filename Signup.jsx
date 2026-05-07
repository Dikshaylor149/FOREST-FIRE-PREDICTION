import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/auth.css";

const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
    phoneNumber: "",
  });

  const { email, password, username, phoneNumber } = inputValue;
  const [showUsernameRules, setShowUsernameRules] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    // ✅ Only digits allowed in phone
    if (name === "phoneNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setInputValue({ ...inputValue, phoneNumber: digitsOnly });
    } else {
      setInputValue({ ...inputValue, [name]: value });
    }
  };

  const handleError = (err) =>
    toast.error(err, { position: "bottom-left" });

  const handleSuccess = (msg) =>
    toast.success(msg, { position: "bottom-right" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailTrim = email.trim();
    const usernameTrim = username.trim();
    const passwordTrim = password.trim();
    const phoneTrim = phoneNumber.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrim || !emailRegex.test(emailTrim)) {
      return handleError("Please enter a valid email");
    }

    const usernameRegex = /^[a-zA-Z0-9]{3,}$/;
    if (!usernameTrim || !usernameRegex.test(usernameTrim)) {
      return handleError(
        "Username must be at least 3 characters and contain only letters and numbers"
      );
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordTrim || !passwordRegex.test(passwordTrim)) {
      return handleError(
        "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 number"
      );
    }

    // ✅ Add +91 automatically before sending
    const fullPhone = `+91${phoneTrim}`;

    // ✅ Validate final phone
    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneTrim || !phoneRegex.test(fullPhone)) {
      return handleError("Please enter a valid 10-digit phone number");
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/signup",
        {
          email: emailTrim,
          username: usernameTrim,
          password: passwordTrim,
          phoneNumber: fullPhone, // 👈 goes with +91
        },
        { withCredentials: true }
      );

      if (data.success) {
        handleSuccess(data.message);
        // setTimeout(() => navigate("/login"), 1000);
      } else {
        handleError(data.message);
      }
    } catch {
      handleError("Server error, please try again");
    }

    setInputValue({
      email: "",
      password: "",
      username: "",
      phoneNumber: "",
    });
  };

  return (
    <div className="auth-page">
      <div className="form_container">
        <h2>Signup Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
            />
          </div>

          {/* Username */}
          <div>
            <label>
              Username
              <span
                className="info-icon"
                onClick={() => setShowUsernameRules(!showUsernameRules)}
              >
                ⓘ
              </span>
            </label>
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
            />
            {showUsernameRules && (
              <div className="constraints">
                <p><strong>Username must:</strong></p>
                <ul>
                  <li>Be at least 3 characters long</li>
                  <li>Contain only letters and numbers</li>
                </ul>
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              placeholder="Enter 10-digit phone number"
              onChange={handleOnChange}
              maxLength={10}
            />
          </div>

          {/* Password */}
          <div>
            <label>
              Password
              <span
                className="info-icon"
                onClick={() => setShowPasswordRules(!showPasswordRules)}
              >
                ⓘ
              </span>
            </label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
            />
            {showPasswordRules && (
              <div className="constraints">
                <p><strong>Password must:</strong></p>
                <ul>
                  <li>Be at least 8 characters</li>
                  <li>Include 1 uppercase letter</li>
                  <li>Include 1 lowercase letter</li>
                  <li>Include 1 number</li>
                </ul>
              </div>
            )}
          </div>

          <button type="submit">Submit</button>

          <span style={{ color: "black" }}>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;