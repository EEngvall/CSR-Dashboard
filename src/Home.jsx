import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';
import LottieLink from './Components/LottieLink';
import GraphAnimation from './Animations/GraphAnimation';
import FileUploadAnimation from './Animations/FileUploadAnimation';
import CallAnimation from './Animations/CallAnimation';
import ToDoAnimation from './Animations/ToDoAnimation';
import WorkOrderAnimation from './Animations/WorkOrderAnimation';
import { auth } from './Authentication/firebase';
import SignIn from './Authentication/SignIn';
const Home = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div>
      <div className="container text-center">
        <h2>Home</h2>
        <p>
          Welcome to the CSR Dashboard,
          {user ? ` ${user.email}` : ' please log in to access your account.'}
        </p>
        {user && (
          <div>
            <div className="row">
              <div className="col-md-6">
                <h3>Billing History Visualizer</h3>
                <LottieLink
                  animationData={GraphAnimation}
                  linkTo="/billingHistory"
                />
              </div>
              <div className="col-md-6">
                <h3>Returns File Upload</h3>
                <LottieLink
                  animationData={FileUploadAnimation}
                  linkTo="/returns"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <h3>Returned Items Call Log</h3>
                <LottieLink
                  animationData={CallAnimation}
                  linkTo="/returnsTracker"
                />
              </div>
              <div className="col-md-6">
                <h3>Work Order Log</h3>
                <LottieLink
                  animationData={WorkOrderAnimation}
                  linkTo="/workOrders"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Home;
