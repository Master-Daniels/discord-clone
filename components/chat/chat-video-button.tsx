"use client";

import { Video, VideoOff } from "lucide-react";
import qs from "query-string";

import React from "react";
import ActionToolTip from "../custom/action-tooltip";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const ChatVideoButton = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathName = usePathname();
    const isVideo = searchParams?.get("video");

    const onClick = () => {
        const url = qs.stringifyUrl(
            {
                url: pathName ?? "",
                query: {
                    video: isVideo ? undefined : true,
                },
            },
            { skipNull: true }
        );
        router.push(url);
    };

    const Icon = isVideo ? VideoOff : Video;
    const toolTipLabel = isVideo ? "End Video Call" : "Start vidoe call";
    return (
        <ActionToolTip side="bottom" label={toolTipLabel}>
            <button onClick={onClick} className="hover:opacity-75 transition my-4">
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </button>
        </ActionToolTip>
    );
};

export default ChatVideoButton;
