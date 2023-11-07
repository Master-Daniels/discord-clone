"use client";

import { useParams, useRouter } from "next/navigation";
import { Member, Profile, ROLE, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck, UserCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import UserAvatar from "@components/custom/user-avatar";
import ActionToolTip from "@components/custom/action-tooltip";

interface ServerMemberProps {
    member: Member & { profile: Profile };
    server: Server;
}

const roleIconMap = {
    [ROLE.GUEST]: <UserCircleIcon className="h-4 w-4 mr-2" />,
    [ROLE.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
    [ROLE.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const ServerMember = ({ member, server }: ServerMemberProps) => {
    const router = useRouter();
    const params = useParams();

    const icon = roleIconMap[member.role];

    const handleClick = () => {
        router.push(`/servers/${server?.id}/conversations/${member?.id}`);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "group p-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
                params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
            )}
        >
            <UserAvatar src={member.profile.imageUrl} className="h-8 w-8" alt="member avatar" />
            <p
                className={cn(
                    "font-semibold w-[14ch] text-sm text-zinc-500 gruop-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition truncate",
                    params?.channelId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                )}
            >
                {member.profile.name}
            </p>
            <ActionToolTip label={member.role} side="top">
                {icon}
            </ActionToolTip>
        </button>
    );
};

export default ServerMember;
