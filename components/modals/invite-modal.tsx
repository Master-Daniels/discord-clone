"use client";

import { useState } from "react";

import { useModal } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";

import { Dialog, DialogHeader, DialogTitle, DialogContent } from "@components/ui/dialog";
import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { CheckCheckIcon, Copy, RefreshCw } from "lucide-react";

import axios from "axios";
import { cn } from "@/lib/utils";

const InviteModal = () => {
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const modal = useModal();
    const origin = useOrigin();

    const isModalOpen = modal.isOpen && modal.type === "invite";

    const inviteCode = modal.data?.server?.inviteCode;
    const inviteUrl = `${origin}/invite/${inviteCode}`;

    const copy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const regenerateInvite = async () => {
        try {
            setIsLoading(true);
            const serverId = modal.data.server?.id;
            const response = await axios.patch(`/api/servers/${serverId}/invite-code`);
            modal.open("invite", { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={modal.close}>
            <DialogContent className="bg-white text-black p-0" showCancel>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold uppercase underline underline-offset-2">
                        Invite Friends
                    </DialogTitle>
                    <div className="p-6">
                        <Label className="uppercase text-sm font-bold text-zinc-500 dark:text-secondary/70">
                            Server Invite Link
                        </Label>
                        <div className="flex items-center mt-2 gap-x-2">
                            <Input
                                disabled={isLoading}
                                className="bg-zinc-300/50 border-0 focus:!ring-0 focus-visible:ring-offset-0 focus-visible:!ring-0 text-black"
                                value={inviteUrl}
                                readOnly
                            />
                            <Button size="icon" title="copy" onClick={copy} disabled={isLoading}>
                                {copied ? <CheckCheckIcon className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                        <Button
                            className="text-xs text-zinc-500 mt-4"
                            variant="link"
                            disabled={isLoading}
                            onClick={regenerateInvite}
                        >
                            Generate a new link
                            <RefreshCw className={cn("w-4 h-4 ml-2", isLoading && "animate-spin")} />
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default InviteModal;
