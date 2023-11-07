"use client";

import { config } from "@/lib/config";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = new (ClientIO as any)(config.siteUrl, {
            path: "/api/socket/io",
            addTrailingSlash: false,
            transport: ["websockets"],
        });

        socketInstance.on("connect", () => {
            setSocket(socketInstance);
            setIsConnected(true);

            socketInstance.emit("activity", "master daniels");
        });

        socketInstance.on("disconnect", () => setIsConnected(false));

        return () => socketInstance.disconnect();
    }, []);

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
