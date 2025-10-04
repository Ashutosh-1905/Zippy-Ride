import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const skt = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    skt.on("connect", () => {
      console.log("Socket connected:", skt.id);
    });

    skt.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    setSocket(skt);

    return () => {
      skt.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
 