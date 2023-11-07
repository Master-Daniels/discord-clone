import { useEffect, useState } from "react";

type ChatScrollProps = {
    chatRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
    shouldLoadMore: boolean;
    loadMore: () => void;
    count: number;
};

export default function useChatScroll({ chatRef, bottomRef, shouldLoadMore, loadMore, count }: ChatScrollProps) {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        const topDiv = chatRef?.current;
        const handleScroll = () => {
            const scrollTop = topDiv?.scrollTop;

            if (scrollTop && shouldLoadMore) loadMore();
        };
        topDiv?.addEventListener("scroll", handleScroll);
        return () => topDiv?.removeEventListener("scroll", handleScroll);
    }, [chatRef, shouldLoadMore, loadMore]);

    useEffect(() => {
        const topDiv = chatRef?.current;
        const bottomDiv = bottomRef?.current;

        const shouldAutoScroll = () => {
            if (!initialized && bottomDiv) {
                setInitialized(true);
                return true;
            }
            if (!topDiv) return false;

            const distanceFromBottom = topDiv?.scrollHeight - topDiv?.scrollTop - topDiv?.clientHeight;
            return distanceFromBottom <= 100;
        };

        if (shouldAutoScroll()) {
            setTimeout(() => {
                bottomDiv?.scrollIntoView({
                    behavior: "smooth",
                });
            }, 100);
        }
    }, [bottomRef, chatRef, initialized]);
}
