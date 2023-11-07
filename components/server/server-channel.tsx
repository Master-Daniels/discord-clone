"use client";

import { cn } from "@/lib/utils";
import { CHANNELTYPE, Channel, ROLE, Server } from "@prisma/client";
import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ActionToolTip from "../custom/action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface ServerChannelProps {
    channel: Channel;
    server: Server;
    role?: ROLE;
}

const iconMap = {
    [CHANNELTYPE.TEXT]: Hash,
    [CHANNELTYPE.AUDIO]: Mic,
    [CHANNELTYPE.VIDEO]: Video,
};
const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
    const { open } = useModal();

    const router = useRouter();
    const params = useParams();

    const Icon = iconMap[channel.type];

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/channels/${channel?.id}`);
    };
    const onAction = (event: React.MouseEvent, action: ModalType) => {
        event.stopPropagation();
        open(action, { server, channel });
    };
    return (
        <button
            onClick={onClick}
            className={cn(
                "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <Icon className="flex-shrink-0 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
            <p
                className={cn(
                    "line-clamp-1 font-semibold text-xs text-zinc-500 group-hovertext-zinc-600 dark:text-zinc-400 darK;group-hover:text-zinc-300 transition",
                    params?.channelId === channel.id && "text-primary dark:text-zinc-200 dark:group-hover:text-wite"
                )}
            >
                {channel.name}
            </p>
            {channel.name !== "general" && role !== ROLE.GUEST && (
                <div className="ml-auto flex items-center gap-x-2">
                    <ActionToolTip label="Edit">
                        <Edit
                            onClick={(e) => onAction(e, "editChannel")}
                            className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                        />
                    </ActionToolTip>
                    <ActionToolTip label="Delete">
                        <Trash
                            onClick={(e) => onAction(e, "deleteChannel")}
                            className="hidden group-hover:block w-4 h-4 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition"
                        />
                    </ActionToolTip>
                </div>
            )}
            {channel.name === "general" && (
                <ActionToolTip label="Locked">
                    <Lock className="hidden group-hover:block ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-100" />
                </ActionToolTip>
            )}
        </button>
    );
};

export default ServerChannel;
