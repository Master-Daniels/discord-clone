"use client";

import { useParams, useRouter } from "next/navigation";
import ActionToolTip from "@components/custom/action-tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
}
export default function NavigationItem({ id, name, imageUrl }: NavigationItemProps) {
    const params = useParams();
    const router = useRouter();

    return (
        <ActionToolTip side="right" align="center" label={name}>
            <button
                className="group relative flex items-center"
                onClick={() => {
                    router.push(`/servers/${id}`);
                }}
            >
                <div
                    className={cn(
                        "absolute left-0 bg-emerald-500 dark:bg-white rounded-r-full transition-all w-[6px]",
                        params?.serverId === id
                            ? "h-[36px] bg-black dark:bg-emerald-500"
                            : "h-[10px] group-hover:h-[36px]"
                    )}
                />
                <div
                    className={cn(
                        "relative group flex h-[48px] w-[48px] mx-4 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                        params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                    )}
                >
                    <Image fill sizes="100vw" src={imageUrl} alt={name} priority />
                </div>
            </button>
        </ActionToolTip>
    );
}
