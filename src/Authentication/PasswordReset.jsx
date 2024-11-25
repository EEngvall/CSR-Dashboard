import React, { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "../CustomColors.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Password reset email sent successfully. Please check your inbox."
      );
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="card p-4"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}
      >
        <h3 className="text-center mb-4">Reset Password</h3>
        {message && <p style={{ color: "green" }}>{message}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handlePasswordReset}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary custom-btn-blue w-100 mt-3"
          >
            Send Reset Email
          </button>
        </form>
        <div className="text-center mt-3">
          <a href="/sign-in" className="text-decoration-none">
            Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
