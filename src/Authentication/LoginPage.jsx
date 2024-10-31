import React, { useState } from 'react';
import { auth } from './firebase'; // Import the auth object

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setRedirectToHome(true); // Set flag to redirect to home page
    } catch (error) {
      setError(error.message); // Handle sign-in errors
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
      {redirectToHome && <Navigate to="/" />}{' '}
    </div>
  );
};

export default LoginPage;
