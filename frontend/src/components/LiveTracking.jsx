import React, { useState, useEffect, useContext } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { SocketContext } from '../context/SocketContext';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const LiveTracking = ({ ride }) => {
    const { socket } = useContext(SocketContext);
    const [captainLocation, setCaptainLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);

    useEffect(() => {
        if (!socket || !ride) return;

        // Listen for real-time location updates
        socket.on('user-location-update', (data) => {
            setUserLocation({
                lat: data.location.lat,
                lng: data.location.lng,
            });
        });

        // Cleanup on component unmount
        return () => {
            socket.off('user-location-update');
        };
    }, [socket, ride]);

    useEffect(() => {
        if (navigator.geolocation) {
            const watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCaptainLocation(newLocation);
                    setMapCenter(newLocation);
                    
                    // Emit location update to the server
                    if (socket) {
                        socket.emit('captain-location-update', {
                            rideId: ride._id,
                            location: newLocation,
                        });
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
            );

            // Cleanup function to stop watching position
            return () => navigator.geolocation.clearWatch(watchId);
        }
    }, [socket, ride]);

    if (!mapCenter) {
        return <div className="loading-map-container">Loading map...</div>;
    }

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={mapCenter}
                zoom={15}
            >
                {captainLocation && <Marker position={captainLocation} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png" }} />}
                {userLocation && <Marker position={userLocation} icon={{ url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png" }} />}
            </GoogleMap>
        </LoadScript>
    );
};

export default LiveTracking;