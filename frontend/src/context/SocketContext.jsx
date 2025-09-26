import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_BASE_URL, {
            transports: ['websocket'],
            withCredentials: true,
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Connected to server');
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
        });

        return () => {
            newSocket.disconnect();
            console.log('🔌 Socket disconnected on cleanup');
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};