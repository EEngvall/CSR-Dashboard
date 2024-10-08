import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Home from "./Home";
import BillingHistory from "./BillingVisualizer/BillingHistory";
import FileUpload from "./Returns/FileUpload";
import TaskList from "./Tasks/TaskList";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import WorkOrderTracker from "./WorkOrders/WorkOrderTracker";
import ReturnTrackerMain from "./Returns/ReturnTrackerMain";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/workOrders" element={<WorkOrderTracker />} />
            <Route path="/returnstracker" element={<ReturnTrackerMain />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </Router>
  );
};

export default App;
