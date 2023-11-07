"use client";

import { useModal } from "@/hooks/use-modal-store";
import ActionToolTip from "@components/custom/action-tooltip";
import { Plus } from "lucide-react";

const NavigationAction = () => {
    const { open } = useModal();
    return (
        <div>
            <ActionToolTip side="right" align="center" label="Add a server">
                <button className="group">
                    <div
                        onClick={() => open("createServer")}
                        className="flex mx-3 w-[48px] h-[48px] rounded-[24px] group-hover:rounded-[16px] group-hover:bg-emerald-500 transition-all duration-1000 overflow-hidden items-center justify-center bg-neutral-300 dark:bg-neutral-700"
                    >
                        <Plus className="group-hover:text-white transition-all text-emerald-500" size={25} />
                    </div>
                </button>
            </ActionToolTip>
        </div>
    );
};

export default NavigationAction;
