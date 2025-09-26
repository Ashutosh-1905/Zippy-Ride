import React from 'react';

const ConfirmRide = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-full absolute top-0' onClick={() => {
                // Return to the previous state (VehiclePanel)
                props.setConfirmRidePanel(false); 
            }}>
                <i className="text-3xl text-gray-400 ri-arrow-down-wide-line"></i>
            </h5>
            <h3 className='text-2xl font-semibold mb-5'>Confirm your Ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg" alt="Vehicle Type" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.fare[props.vehicleType]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => {
                        props.createRide();
                        props.setConfirmRidePanel(false);
                        props.setVehicleFound(true); 
                    }} 
                    className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'
                >
                    Confirm Ride
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide;