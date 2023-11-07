"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { CHANNELTYPE, ROLE } from "@prisma/client";
import ActionToolTip from "../custom/action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string;
    role?: ROLE;
    sectionType: "channels" | "members";
    channelType?: CHANNELTYPE;
    server?: ServerWithMembersWithProfiles;
}
const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
    const { open } = useModal();
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">{label}</p>
            {role !== ROLE.GUEST && sectionType === "channels" && (
                <ActionToolTip label="Create Channel" side="top">
                    <button
                        onClick={() => open("createChannel", { channelType })}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-40 dark:text-zinc-300 transition"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </ActionToolTip>
            )}
            {role === ROLE.ADMIN && sectionType === "members" && (
                <ActionToolTip label="Create members" side="top">
                    <button
                        onClick={() => open("members", { server })}
                        className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-40 dark:text-zinc-300 transition"
                    >
                        <Settings className="w-4 h-4" />
                    </button>
                </ActionToolTip>
            )}
        </div>
    );
};

export default ServerSection;
