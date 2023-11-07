import { Hash } from "lucide-react";
import MobileToggle from "@components/custom/mobile-toggle";
import UserAvatar from "../custom/user-avatar";
import { SocketIndicator } from "@components/custom/socket-indicator";
import ChatVideoButton from "./chat-video-button";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
}
const ChatHeader = ({ serverId, type, name, imageUrl }: ChatHeaderProps) => {
    return (
        <div className="text-md font-semibold px-3 flex items-center h-14 border-neutral-300 dark:border-neutral-600 border-b-2">
            <MobileToggle {...{ serverId }} />
            <div className="ml-4 flex items-center">
                {type === "channel" && <Hash className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />}
                {type === "conversation" && (
                    <UserAvatar src={imageUrl} className="h-6 w-6 mr-2 md:h-8 md:w-8" alt="user image" />
                )}

                <p className="font-semibold text-zinc-700 dark:text-white">{name}</p>
            </div>
            <div className="ml-auto flex items-center">
                {type === "conversation" && <ChatVideoButton />}
                <SocketIndicator />
            </div>
        </div>
    );
};

export default ChatHeader;
