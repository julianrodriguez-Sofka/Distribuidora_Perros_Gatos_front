import React, { useState, useEffect } from "react";
import { verifyEmailCode, resendVerificationCode } from "../../services/auth-service";
import { useToast } from "../../hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";

const VerificationCodePage = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyEmailCode(email, code);
      showToast("Email verified successfully.", "success");
      navigate("/login");
    } catch (error) {
      showToast(error?.message || "Invalid code or expired.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await resendVerificationCode(email);
      showToast("Verification code resent.", "success");
    } catch (error) {
      showToast(error?.message || "Error resending code.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-code-container">
      <h2>Verify Email</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="code">Verification Code</label>
        <input
          type="text"
          id="code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          maxLength={6}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <button onClick={handleResend} disabled={loading}>
        Resend Code
      </button>
    </div>
  );
};

export default VerificationCodePage;
