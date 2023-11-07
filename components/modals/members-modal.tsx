"use client";

import { useState } from "react";
import { ROLE } from "@prisma/client";

import qs from "query-string";

import { useModal } from "@/hooks/use-modal-store";

import { ServerWithMembersWithProfiles } from "@/types";

import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogDescription } from "@components/ui/dialog";
import { ScrollArea } from "@components/ui/scroll-area";
import UserAvatar from "@components/custom/user-avatar";

import {
    Check,
    Gavel,
    Loader2,
    LucideShieldCheck,
    MoreVertical,
    Shield,
    ShieldCheck,
    ShieldQuestion,
    UserCircleIcon,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const roleIconMap = {
    GUEST: <UserCircleIcon className="w-4 h-4 text-neutral-500" />,
    ADMIN: <LucideShieldCheck className="w-4 h-4 text-rose-500" />,
    MODERATOR: <ShieldCheck className="w-4 h-4 text-indigo-500" />,
};

const MembersModal = () => {
    const [loadingId, setLoadingId] = useState("");
    const { type, data, close, isOpen } = useModal();
    const isModalOpen = isOpen && type === "members";

    const { server } = data as { server: ServerWithMembersWithProfiles };

    const changeMemberRole = (memberId: string, role: ROLE) => {
        try {
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                    memberId,
                },
            });
            ///////////////////////////////
            // const url2 = new URLSearchParams(`api/members/${memberId}`);
            // url2.set("serverId", server?.id);
            // url2.set("memberId", memberId);
            // console.log(...url2.entries());
            /////////////////////////////////////////////
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingId("");
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={close}>
            <DialogContent className="bg-white text-black" showCancel>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold uppercase underline underline-offset-2">
                        Manage Members
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {server?.members?.length} member{server?.members?.length > 1 && "s"}.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-8 max-h-[420px] pr-6">
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <UserAvatar src={member.profile.imageUrl} alt="member avatar" />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs font-semibold capitalize flex gap-x-1 items-center">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <p className="text-xs text-zinc-500">{member.profile.email}</p>
                            </div>
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="w-5 h-5 font-semibold text-zinc-500" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
                                                    <ShieldQuestion className="w-4 h-4 mr-2" />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent sideOffset={6}>
                                                        <DropdownMenuItem>
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Guest
                                                            {member.role === ROLE.GUEST && (
                                                                <Check className="h-4 w-4 ml-auto" />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Shield className="h-4 w-4 mr-2" />
                                                            Moderator
                                                            {member.role === ROLE.MODERATOR && (
                                                                <Check className="h-4 w-4 ml-1" />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>
                                                <Gavel className="w-4 h-4 mr-2" />
                                                Kick
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 className="animate-spin text-zinc-500 ml-auto w-5 h-5" />
                            )}
                        </div>
                    ))}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default MembersModal;
