import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { auth } from './Authentication/firebase';
import SignOut from './Authentication/SignOut';
import SignIn from './Authentication/SignIn';

const Navbar = () => {
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const [user, setUser] = useState(null);

  return (
    <nav className="navbar navbar-expand-lg custom-nav-blue">
      <div className="container custom-nav-blue">
        <Link className="navbar-brand custom-nav-blue" to="/">
          CSR Dashboard
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {user ? (
          <div className="collapse navbar-collapse " id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item ">
                <Link className="nav-link custom-nav-blue " to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-nav-blue" to="/billingHistory">
                  Billing History
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-nav-blue" to="/returns">
                  Returns File Upload
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-nav-blue" to="/returnsTracker">
                  Return Call List
                </Link>
              </li>
              {/*<li className="nav-item">
                <Link className="nav-link custom-nav-blue" to="/tasks">
                  Tasks
                </Link>
              </li>*/}
              <li className="nav-item">
                <Link className="nav-link custom-nav-blue" to="/workOrders">
                  Work Orders
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link custom-nav-blue" to="/VEE">
                  VEE
                </Link>
              </li>
              {/*<li className="nav-item">
                <Link className="nav-link custom-nav-blue" to="/Email">
                  Email Parser
                </Link>
              </li>
              */}
            </ul>
            <ul class="navbar-nav ml-auto">
              <li className="nav-item">
                <SignOut />
              </li>
            </ul>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
