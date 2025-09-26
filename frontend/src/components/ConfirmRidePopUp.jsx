import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState(null);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setOtpError(null);

        if (!props.ride) {
            setOtpError("Ride data is missing.");
            return;
        }

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
                {
                    params: {
                        rideId: props.ride._id,
                        otp: otp
                    },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.status === 200) {
                props.setConfirmRidePopupPanel(false);
                // Navigate to the riding page and pass ride details
                navigate('/captain-riding', { state: { ride: props.ride } });
            }
        } catch (error) {
            console.error("Failed to start ride:", error.response?.data?.message || error.message);
            setOtpError(error.response?.data?.message || "Invalid OTP or an error occurred.");
        }
    };

    return (
        <div>
            <h5 className='p-1 text-center w-full absolute top-0' onClick={() => {
                props.setConfirmRidePopupPanel(false);
            }}>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Confirm this ride to Start</h3>
            
            <div className='flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="Rider Profile" />
                    <h2 className='text-lg font-medium capitalize'>{props.ride?.user?.fullname?.firstName}</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>
            
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>

                <div className='mt-6 w-full'>
                    <form onSubmit={submitHandler}>
                        <input value={otp} onChange={(e) => setOtp(e.target.value)} type="text" className='bg-[#eee] px-6 py-4 font-mono text-lg rounded-lg w-full mt-3' placeholder='Enter OTP' />
                        {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
                        <button className='w-full mt-5 text-lg flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg'>
                            Start Ride
                        </button>
                        <button type="button" onClick={() => props.setConfirmRidePopupPanel(false)} className='w-full mt-2 bg-red-600 text-lg text-white font-semibold p-3 rounded-lg'>
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConfirmRidePopUp;