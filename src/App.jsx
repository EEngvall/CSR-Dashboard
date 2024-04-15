import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import BillingHistory from "./BillingHistory";
import FileUpload from "./FileUpload";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/billingHistory" element={<BillingHistory />} />
            <Route path="/billingHistory" element={<BillingHistory />} />
            <Route path="/returns" element={<FileUpload />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
