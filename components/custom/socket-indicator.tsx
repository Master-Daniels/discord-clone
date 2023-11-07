"use client";

import { useSocket } from "@components/providers/socket-provider";
import { Badge } from "../ui/badge";

export const SocketIndicator = () => {
    const { isConnected, socket } = useSocket();

    if (!isConnected) {
        return (
            <Badge variant="outline" className="bg-yellow-600 text-white border-none">
                Fallback<span className="hidden sm:block">: poliing every second</span>
            </Badge>
        );
    }

    // const disconnect = () => {
    //     if (socket?.connected) socket.disconnect();
    // };

    return (
        // <div onClick={disconnect} className="cursor-pointer">
        <Badge variant="outline" className="bg-emerald-600 text-white border-none">
            Live<span className="hidden sm:block">: Real time updates</span>
        </Badge>
        // </div>
    );
};
