import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SessionTimeoutHandler = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const sessionTimeout = 30 * 60 * 1000; // Set timeout duration (e.g., 30 minutes)

  useEffect(() => {
    let logoutTimer;
    const startSessionTimer = () => {
      // Clear any existing timer
      clearTimeout(logoutTimer);

      // Set a new timer
      logoutTimer = setTimeout(() => {
        signOut(auth)
          .then(() => {
            navigate("/sign-in"); // Redirect to sign-in page after logout
            alert("Your session has expired. Please sign in again.");
          })
          .catch((error) => console.error("Sign out error:", error));
      }, sessionTimeout);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        startSessionTimer();
      } else {
        clearTimeout(logoutTimer); // Clear timer when user logs out
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(logoutTimer); // Clean up timer on component unmount
    };
  }, [auth, navigate, sessionTimeout]);

  return null; // This component only manages session timeout, no UI
};

export default SessionTimeoutHandler;
