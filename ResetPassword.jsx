import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "../styles/auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  if (!token) {
    return <p>Invalid or missing token</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:4000/reset-password/${token}`,
        { password }
      );

      if (data.success) {
        toast.success(data.message, { position: "bottom-left" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message, { position: "bottom-left" });
      }
    } catch (error) {
      toast.error("Server error", { position: "bottom-left" });
    }
  };

  return (
    <div className="auth-page">
      <div className="form_container">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label>New Password</label>
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ResetPassword;
