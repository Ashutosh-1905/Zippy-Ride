import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

  const navigate = useNavigate();
  const captainHomeRef = useRef(null);
  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  // Use a single GSAP context for better cleanup
  useGSAP(
    () => {
      if (ridePopupPanel) {
        gsap.to(ridePopupPanelRef.current, {
          transform: 'translateY(0)',
          duration: 0.5,
        });
      } else {
        gsap.to(ridePopupPanelRef.current, {
          transform: 'translateY(100%)',
          duration: 0.5,
        });
      }

      if (confirmRidePopupPanel) {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: 'translateY(0)',
          duration: 0.5,
        });
      } else {
        gsap.to(confirmRidePopupPanelRef.current, {
          transform: 'translateY(100%)',
          duration: 0.5,
        });
      }
    },
    { dependencies: [ridePopupPanel, confirmRidePopupPanel], scope: captainHomeRef }
  );

  const handleLogout = () => {
    // Perform logout logic here, e.g., clear localStorage, API call
    localStorage.removeItem('token');
    navigate('/captain-login');
  };

  return (
    <div ref={captainHomeRef} className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <button
          onClick={handleLogout}
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>
      </div>
      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
          alt=""
        />
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;