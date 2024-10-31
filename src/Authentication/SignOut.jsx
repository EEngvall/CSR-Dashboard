import React from 'react';
import { auth } from './firebase'; // Import the auth object

const SignOut = () => {
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        // You can redirect to a login page or another route here.
        // For example:
        // window.location.href = '/login';
      })
      .catch((error) => {
        // An error happened.
        console.error(error);
      });
  };

  return (
    <button
      className="btn btn-sm btn-outline-light mt-1"
      onClick={handleSignOut}
    >
      Sign Out
    </button>
  );
};

export default SignOut;
