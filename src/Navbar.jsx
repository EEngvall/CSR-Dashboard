import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
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
        <div className="collapse navbar-collapse " id="navbarNav">
          <ul className="navbar-nav">
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
            <li className="nav-item">
              <Link className="nav-link custom-nav-blue" to="/tasks">
                Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link custom-nav-blue" to="/workOrders">
                Work Orders
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
