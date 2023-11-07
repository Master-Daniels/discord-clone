"use client";

import { useState } from "react";

import axios from "axios";
import { useRouter } from "next/navigation";

import qs from "query-string";

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

const DeleteChannelModal = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const modal = useModal();

    const { server, channel } = modal?.data;

    const isModalOpen = modal.isOpen && modal.type === "deleteChannel";

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            });
            await axios.delete(url);

            modal.close();
            router.push(`/servers/${server?.id}`);
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
                        Delete Channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 py-2">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-indigo-500">#{channel?.name}.</span> It will be permanently
                        deleted!
                    </DialogDescription>
                    <DialogFooter className="bg-gray-100 px-6 py-4">
                        <div className="flex items-center justify-between w-full">
                            <Button disabled={isLoading} onClick={modal.close} variant="ghost">
                                Cancel
                            </Button>
                            <Button disabled={isLoading} onClick={handleDelete} variant="primary">
                                Confirm
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteChannelModal;
