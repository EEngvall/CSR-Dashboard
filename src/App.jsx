import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import BillingHistory from './BillingVisualizer/BillingHistory';
import FileUpload from './Returns/FileUpload';
import TaskList from './Tasks/TaskList';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import WorkOrderTracker from './WorkOrders/WorkOrderTracker';
import ReturnTrackerMain from './Returns/ReturnTrackerMain';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VeeCalulatorMain from './VEE/VeeCalculatorMain';
import EmailParser from './EmailParser/EmailParser';
import LoginPage from './Authentication/LoginPage';
import { auth } from './Authentication/firebase';
import ProtectedRoute from './Authentication/ProtectedRoute';
import SignIn from './Authentication/SignIn';
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false); // Set loading to false once the auth check is complete
    });
    return () => unsubscribe();
  }, []);
  if (loading) {
    return <div>Loading...</div>; // Replace with a loading spinner or animation if needed
  }
  return (
    <Router>
      <div>
        <Navbar user={user} />
        <div className="container mt-4">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billingHistory"
              element={
                <ProtectedRoute user={user}>
                  <BillingHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/returns"
              element={
                <ProtectedRoute user={user}>
                  <FileUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute user={user}>
                  <TaskList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/workOrders"
              element={
                <ProtectedRoute user={user}>
                  <WorkOrderTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/returnstracker"
              element={
                <ProtectedRoute user={user}>
                  <ReturnTrackerMain />
                </ProtectedRoute>
              }
            />
            <Route
              path="/VEE"
              element={
                <ProtectedRoute user={user}>
                  <VeeCalulatorMain />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Email"
              element={
                <ProtectedRoute user={user}>
                  <EmailParser />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<SignIn />} />
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </Router>
  );
};
export default App;
