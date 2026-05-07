import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:4000/forgot-password",
        { email }
      );

      if (data.success) {
        toast.success(data.message, { position: "bottom-left" });
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
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Send Reset Link</button>
      </form>

      <ToastContainer />
    </div>
    </div>
  );
};

export default ForgotPassword;
