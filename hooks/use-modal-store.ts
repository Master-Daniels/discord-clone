import { CHANNELTYPE, Channel, Server } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
    | "createServer"
    | "invite"
    | "editServer"
    | "members"
    | "createChannel"
    | "leaveServer"
    | "deleteServer"
    | "deleteChannel"
    | "editChannel"
    | "fileMessage"
    | "deleteMessage";

interface ModalData {
    server?: Server;
    channelType?: CHANNELTYPE;
    channel?: Channel;
    apiUrl?: string;
    query?: {
        [key: string]: any;
    };
}

interface ModalStore {
    type: ModalType | null;
    isOpen: boolean;
    data: ModalData;
    open(type: ModalType, data?: ModalData): void;
    close: () => void;
}

export const useModal = create<ModalStore>((set) => ({
    type: null,
    isOpen: false,
    data: {},
    open(type, data = {}) {
        set({ isOpen: true, type, data });
    },
    close: () => {
        set({ isOpen: false, type: null, data: {} });
    },
}));
