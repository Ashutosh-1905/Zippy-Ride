import React from 'react';
import CaptainDetails from './CaptainDetails'; // New component to show captain details

const WaitingForDriver = ({ ride }) => {
    if (!ride || !ride.captain) {
        return (
            <div className='text-center p-5'>
                <h3 className='text-lg font-semibold text-red-500'>Error: Captain details not found.</h3>
                <p>Please try again or contact support.</p>
            </div>
        );
    }
    
    return (
        <div className='relative'>
            <h5 className='p-1 text-center w-full absolute top-0'>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </h5>

            <div className='text-center my-4'>
                <h3 className='text-2xl font-bold'>Your Ride is Confirmed!</h3>
                <p className='text-gray-600'>Captain is on the way.</p>
            </div>

            <CaptainDetails captain={ride.captain} otp={ride.otp} />

            <div className='w-full mt-5'>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="ri-map-pin-user-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium'>Pickup</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{ride.pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2'>
                    <i className="text-lg ri-map-pin-2-fill"></i>
                    <div>
                        <h3 className='text-lg font-medium'>Destination</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{ride.destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className="ri-currency-line"></i>
                    <div>
                        <h3 className='text-lg font-medium'>₹{ride.fare}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default WaitingForDriver;