import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/verify-email/${token}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          await Swal.fire({
            icon: "success",
            title: "Email Verified!",
            text: "Your account has been verified successfully.",
            confirmButtonColor: "#2ecc71",
          });

          // 👉 After user clicks OK
          navigate("/login"); 
        } else {
          await Swal.fire({
            icon: "error",
            title: "Verification Failed",
            text: res.data.message || "Invalid or expired link.",
            confirmButtonColor: "#e74c3c",
          });

          navigate("/signup");
        }
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Verification Failed",
          text: "Invalid or expired verification link.",
        });

        navigate("/signup");
      }
    };

    verifyUser();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Verifying your email...</h2>
    </div>
  );
}