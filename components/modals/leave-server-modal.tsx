"use client";

import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";

import { useModal } from "@/hooks/use-modal-store";

import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogDescription,
    DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";

const LeaveServerModal = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const modal = useModal();

    const server = modal.data.server;

    const isModalOpen = modal.isOpen && modal.type === "leaveServer";

    const handleLeave = async () => {
        try {
            setIsLoading(true);
            await axios.patch(`/api/servers/${server?.id}/leave`);
            modal.close();
            router.refresh();
        } catch (error) {
            console.log({ error });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={modal.close}>
            <DialogContent className="bg-white text-black p-0" showCancel>
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold uppercase underline underline-offset-2">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Are you sure you want to leave{" "}
                        <span className="font-semibold text-indigo-500">{server?.name}</span>
                    </DialogDescription>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between w-full">
                            <Button disabled={isLoading} onClick={modal.close} variant="ghost">
                                Cancel
                            </Button>
                            <Button disabled={isLoading} onClick={handleLeave} variant="primary">
                                Confirm
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default LeaveServerModal;
