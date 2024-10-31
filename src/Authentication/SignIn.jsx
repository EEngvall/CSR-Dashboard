import React, { useState } from 'react';
import { auth } from './firebase'; // Import the auth object
import { useNavigate } from 'react-router-dom';
import '../CustomColors.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigate('/'); // Redirect to the default route after successful sign-in
    } catch (error) {
      setError(error.message); // Handle sign-in errors
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center ">
      <div
        className="card p-4"
        style={{ maxWidth: '400px', width: '100%', borderRadius: '10px' }}
      >
        <h3 className="text-center mb-4">Sign In</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSignIn}>
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
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary custom-btn-blue w-100 mt-3"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
export default SignIn;
