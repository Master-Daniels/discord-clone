"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ROLE } from "@prisma/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role?: ROLE | undefined;
}
const ServerHeader = ({ server, role }: ServerHeaderProps) => {
    const { open } = useModal();

    const isAdmin = role === ROLE.ADMIN;
    const isModerator = isAdmin || ROLE.MODERATOR;

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none" asChild>
                    <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                        {server.name}
                        <ChevronDown className="h-5 w-5 ml-auto" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]">
                    {isModerator && (
                        <DropdownMenuItem
                            onClick={() => open("invite", { server })}
                            className="px-3 py-2 text-sm cursor-pointer hover:!text-indigo-500 transition duration-1000"
                        >
                            Invite People
                            <UserPlus className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => open("editServer", { server })}
                            className="px-3 py-2 text-sm cursor-pointer hover:!text-indigo-500 transition duration-1000"
                        >
                            Server Settings
                            <Settings className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => open("members", { server })}
                            className="px-3 py-2 text-sm cursor-pointer hover:!text-indigo-500 transition duration-1000"
                        >
                            Manage Members
                            <Users className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isModerator && (
                        <DropdownMenuItem
                            onClick={() => open("createChannel")}
                            className="px-3 py-2 text-sm cursor-pointer hover:!text-indigo-500 transition duration-1000"
                        >
                            Create Channel
                            <PlusCircle className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {isModerator && <DropdownMenuSeparator />}
                    {isAdmin && (
                        <DropdownMenuItem
                            onClick={() => open("deleteServer", { server })}
                            className="text-rose-500 px-3 py-2 text-sm cursor-pointer hover:!text-rose-500 transition duration-1000"
                        >
                            Delete Server
                            <Trash className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                    {!isAdmin && (
                        <DropdownMenuItem
                            onClick={() => open("leaveServer", { server })}
                            className="text-rose-500 px-3 py-2 text-sm cursor-pointer hover:!text-rose-500 transition duration-1000"
                        >
                            Leave Server
                            <LogOut className="h-4 w-4 ml-auto" />
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default ServerHeader;
