"use client";

import "@livekit/components-styles";
import {
    LiveKitRoom,
    VideoConference,
    GridLayout,
    ParticipantTile,
    ControlBar,
    AudioConference,
    RoomAudioRenderer,
} from "@livekit/components-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

interface MediaRoomProps {
    chatId: string;
    video: boolean;
    audio: boolean;
}
export default function MediaRoom({ chatId, video, audio }: MediaRoomProps) {
    const { user } = useUser();
    const [token, setToken] = useState("");

    useEffect(() => {
        if (!user?.firstName || !user?.lastName) return;
        const name = `${user?.firstName} ${user?.lastName}`;
        (async () => {
            try {
                const res = await fetch(`/api/get-participant-token?room=${chatId}&username=${name}`);
                const data = await res.json();
                setToken(data.token);
            } catch (e) {
                console.error(e);
            }
        })();
    }, [user?.firstName, user?.lastName, chatId]);

    if (token === "") {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <Loader2 className="w-7 sm:w-10 h-7 sm:h-10 text-zinc-500 animate-spin my-4" />
                <p className="text-xs sm:text-base text-zinc-500 dark:text-zinc-400">Loading...</p>
            </div>
        );
    }

    if (!video && audio) {
        return (
            <div className="flex flex-col !h-[calc(100%_-_(4rem_+_69px))] items-center justify-center rounded-lg">
                <LiveKitRoom
                    video={video}
                    audio={audio}
                    token={token}
                    connectOptions={{ autoSubscribe: false }}
                    serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                    data-lk-theme="default"
                    className="!w-auto !rounded-lg"
                >
                    <AudioConference />;
                </LiveKitRoom>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center !h-[calc(100%_-_4rem)] justify-center rounded-lg">
            <LiveKitRoom
                video={video}
                audio={audio}
                token={token}
                connectOptions={{ autoSubscribe: false }}
                serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
                data-lk-theme="default"
                className="!w-[calc(100%_-2rem)] !rounded-lg"
            >
                {/* Your custom component with basic video conferencing functionality. */}
                <VideoConference />
                {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
}
