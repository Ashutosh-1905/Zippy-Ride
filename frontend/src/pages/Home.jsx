import React, { useEffect, useRef, useState, useContext } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import LiveTracking from '../components/LiveTracking';
import { SocketContext } from '../context/SocketContext';
import { UserContext } from '../context/UserContext'; // Corrected import
import { useNavigate } from 'react-router-dom';

const UI_STATE = {
    DEFAULT: 'default',
    SEARCH_LOCATION: 'search_location',
    SELECT_VEHICLE: 'select_vehicle',
    CONFIRM_RIDE: 'confirm_ride',
    LOOKING_FOR_DRIVER: 'looking_for_driver',
    WAITING_FOR_DRIVER: 'waiting_for_driver',
    RIDING: 'riding'
};

const Home = () => {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null);
    const [fare, setFare] = useState({});
    const [vehicleType, setVehicleType] = useState(null);
    const [ride, setRide] = useState(null);
    const [uiState, setUiState] = useState(UI_STATE.DEFAULT);

    const navigate = useNavigate();
    const { socket } = useContext(SocketContext);
    const { user, token } = useContext(UserContext); // Corrected context name

    const panelRef = useRef(null);
    const vehiclePanelRef = useRef(null);
    const confirmRidePanelRef = useRef(null);
    const lookingForDriverRef = useRef(null);
    const waitingForDriverRef = useRef(null);

    useEffect(() => {
        if (!socket || !user) return;

        socket.emit("join", { userType: "user", userId: user._id });

        socket.on('ride-confirmed', (confirmedRide) => {
            setRide(confirmedRide);
            setUiState(UI_STATE.WAITING_FOR_DRIVER);
        });

        socket.on('ride-started', (startedRide) => {
            setRide(startedRide);
            setUiState(UI_STATE.RIDING);
            navigate('/riding', { state: { ride: startedRide } });
        });

        return () => {
            socket.off('ride-confirmed');
            socket.off('ride-started');
        };
    }, [socket, user, navigate]);

    const handleLocationChange = async (e, field) => {
        const value = e.target.value;
        if (field === 'pickup') setPickup(value);
        if (field === 'destination') setDestination(value);

        if (value.length > 2) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params: { input: value },
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuggestions(response.data || []);
            } catch (error) {
                console.error("Error fetching suggestions:", error.response?.data || error.message);
            }
        } else {
            setSuggestions([]);
        }
    };

    useGSAP(() => {
        gsap.to(panelRef.current, { height: uiState === UI_STATE.SEARCH_LOCATION ? '70%' : '0%', padding: uiState === UI_STATE.SEARCH_LOCATION ? 24 : 0, duration: 0.5 });
        gsap.to(vehiclePanelRef.current, { transform: uiState === UI_STATE.SELECT_VEHICLE ? 'translateY(0)' : 'translateY(100%)', duration: 0.5 });
        gsap.to(confirmRidePanelRef.current, { transform: uiState === UI_STATE.CONFIRM_RIDE ? 'translateY(0)' : 'translateY(100%)', duration: 0.5 });
        gsap.to(lookingForDriverRef.current, { transform: uiState === UI_STATE.LOOKING_FOR_DRIVER ? 'translateY(0)' : 'translateY(100%)', duration: 0.5 });
        gsap.to(waitingForDriverRef.current, { transform: uiState === UI_STATE.WAITING_FOR_DRIVER ? 'translateY(0)' : 'translateY(100%)', duration: 0.5 });
    }, [uiState]);

    const handleFindTrip = async () => {
        if (!pickup || !destination) {
            alert("Please select both pickup and destination.");
            return;
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: { Authorization: `Bearer ${token}` }
            });
            setFare(response.data || {});
            setUiState(UI_STATE.SELECT_VEHICLE);
        } catch (error) {
            console.error("Error fetching fare:", error.response?.data || error.message);
            alert("Could not fetch fare. Please try again.");
        }
    };

    const handleCreateRide = async () => {
        if (!vehicleType) {
            alert("Please select a vehicle type.");
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setRide(response.data);
            setUiState(UI_STATE.LOOKING_FOR_DRIVER);

            if (socket) {
                socket.emit('ride-requested', { rideId: response.data._id, pickup });
            }
        } catch (error) {
            console.error("Error creating ride:", error.response?.data || error.message);
            alert("Could not create ride. Please try again.");
        }
    };

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="Uber Logo" />
            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>

            {/* Search Panel */}
            <div className='flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 onClick={() => setUiState(UI_STATE.DEFAULT)} className='absolute right-6 top-6 text-2xl cursor-pointer'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => e.preventDefault()}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => { setActiveField('pickup'); setUiState(UI_STATE.SEARCH_LOCATION); }}
                            value={pickup}
                            onChange={(e) => handleLocationChange(e, 'pickup')}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => { setActiveField('destination'); setUiState(UI_STATE.SEARCH_LOCATION); }}
                            value={destination}
                            onChange={(e) => handleLocationChange(e, 'destination')}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
                            type="text"
                            placeholder='Enter your destination'
                        />
                    </form>
                    <button
                        onClick={handleFindTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full disabled:opacity-50'
                        disabled={!pickup || !destination}
                    >
                        Find Trip
                    </button>
                </div>
            </div>

            {/* Panels */}
            <div ref={panelRef} className='bg-white fixed z-20 bottom-0 left-0 w-full h-0 overflow-hidden'>
                <h5 onClick={() => setUiState(UI_STATE.DEFAULT)} className='absolute right-6 top-6 text-2xl cursor-pointer'>
                        <i className="ri-close-line"></i>
                </h5>
                <LocationSearchPanel
                    suggestions={suggestions}
                    setPickup={setPickup}
                    setDestination={setDestination}
                    activeField={activeField}
                    setPanelOpen={(state) => setUiState(state ? UI_STATE.SEARCH_LOCATION : UI_STATE.DEFAULT)}
                />
            </div>

            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    fare={fare}
                    selectVehicle={setVehicleType}
                    setConfirmRidePanel={() => setUiState(UI_STATE.CONFIRM_RIDE)}
                    setVehiclePanel={() => setUiState(UI_STATE.DEFAULT)}
                />
            </div>

            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={handleCreateRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={() => setUiState(UI_STATE.SELECT_VEHICLE)}
                    setVehicleFound={() => setUiState(UI_STATE.LOOKING_FOR_DRIVER)}
                />
            </div>

            <div ref={lookingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver />
            </div>

            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <WaitingForDriver ride={ride} />
            </div>
        </div>
    );
};

export default Home;